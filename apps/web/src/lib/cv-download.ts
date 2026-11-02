/**
 * cv-download.ts
 * ──────────────
 * Two helpers that let the user download a CV without a print dialog:
 *
 *  1. downloadCvAsPdf(elementId, filename)
 *     - Finds the rendered CV DOM element by ID
 *     - Captures it as a high-DPI canvas (html2canvas)
 *     - Creates an A4 PDF and embeds the canvas image (jsPDF)
 *     - Calculates the correct scale so the content fills A4 exactly,
 *       splitting across multiple pages if the CV is taller than one page
 *     - Triggers a browser download — no print dialog at all
 *
 *  2. downloadCvAsDocx(content, title, filename)
 *     - Reads the structured CvContent object (same data the editor uses)
 *     - Builds a proper .docx file with headings, paragraphs, and tables
 *       using the `docx` library (runs 100 % in the browser)
 *     - Triggers a browser download
 */

import type { CvContent } from '@/types/cv';

// ── A4 constants ──────────────────────────────────────────────────────────────
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
// jsPDF uses 72 dpi by default; 1 mm = 2.8346 pt
const MM_TO_PT = 2.8346;

// ── PDF download ──────────────────────────────────────────────────────────────
export async function downloadCvAsPdf(
  previewElementId: string,
  filename = 'resume.pdf',
): Promise<void> {
  // Dynamic imports so these large libs are only loaded when needed
  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ]);

  const element = document.getElementById(previewElementId);
  if (!element) {
    throw new Error(`Element #${previewElementId} not found in the DOM`);
  }

  // Find the inner white CV page (strip the grey wrapper bg)
  const cvPage = element.querySelector<HTMLElement>('.cv-printable-page') || element;

  // Capture at 2× DPI for crisp text
  const canvas = await html2canvas(cvPage, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    // Make sure we capture the full height even if the element scrolls
    windowWidth: cvPage.scrollWidth,
    windowHeight: cvPage.scrollHeight,
  });

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pageWidthMm = A4_WIDTH_MM;
  const pageHeightMm = A4_HEIGHT_MM;

  // Scale canvas so it exactly fits the A4 width
  const imgWidthMm = pageWidthMm;
  const imgHeightMm = (canvas.height / canvas.width) * imgWidthMm;

  const totalPages = Math.ceil(imgHeightMm / pageHeightMm);

  for (let page = 0; page < totalPages; page++) {
    if (page > 0) pdf.addPage();

    // We slice the canvas vertically for each page
    const sliceHeightPx = (pageHeightMm / imgWidthMm) * canvas.width;
    const startY = page * sliceHeightPx;

    const sliceCanvas = document.createElement('canvas');
    sliceCanvas.width = canvas.width;
    sliceCanvas.height = Math.min(sliceHeightPx, canvas.height - startY);

    const ctx = sliceCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
      ctx.drawImage(
        canvas,
        0, startY,                       // source x, y
        canvas.width, sliceCanvas.height, // source width, height
        0, 0,                             // dest x, y
        canvas.width, sliceCanvas.height, // dest width, height
      );
    }

    const imgData = sliceCanvas.toDataURL('image/jpeg', 0.95);
    const actualSliceHeightMm = (sliceCanvas.height / canvas.width) * imgWidthMm;

    pdf.addImage(
      imgData,
      'JPEG',
      0, 0,
      imgWidthMm,
      actualSliceHeightMm,
    );
  }

  pdf.save(filename);
}

// ── DOCX download ─────────────────────────────────────────────────────────────
export async function downloadCvAsDocx(
  content: CvContent,
  cvTitle = 'Resume',
  filename = 'resume.docx',
): Promise<void> {
  const [{ Document, Packer, Paragraph, TextRun, HeadingLevel, BorderStyle, Table, TableRow, TableCell, WidthType, AlignmentType, UnderlineType }, { saveAs }] = await Promise.all([
    import('docx'),
    import('file-saver'),
  ]);

  const info = content.personalInfo || {};

  // ── Helper builders ───────────────────────────────────────────────────────
  const heading = (text: string) =>
    new Paragraph({
      text,
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 240, after: 80 },
      border: {
        bottom: { style: BorderStyle.SINGLE, size: 6, color: '4F46E5' },
      },
    });

  const body = (text: string, bold = false) =>
    new Paragraph({
      children: [new TextRun({ text, bold, size: 22 })],
      spacing: { after: 60 },
    });

  const bulletPoint = (text: string) =>
    new Paragraph({
      text,
      bullet: { level: 0 },
      spacing: { after: 40 },
    });

  // ── Document sections ─────────────────────────────────────────────────────
  const children: any[] = [];

  // ── Header: Name + contact ────────────────────────────────────────────────
  if (info.fullName) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: info.fullName,
            bold: true,
            size: 48, // 24 pt
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
      }),
    );
  }

  if (info.headline) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: info.headline, size: 26, color: '4F46E5' })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
      }),
    );
  }

  const contactParts = [
    info.email,
    info.phone,
    [info.city, info.country].filter(Boolean).join(', '),
    info.linkedin,
    info.github,
    info.website,
  ].filter(Boolean);

  if (contactParts.length) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: contactParts.join('  |  '), size: 20, color: '555555' })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      }),
    );
  }

  // ── Summary ────────────────────────────────────────────────────────────────
  if (content.summary) {
    children.push(heading('Professional Summary'));
    children.push(body(content.summary));
  }

  // ── Experience ─────────────────────────────────────────────────────────────
  if (content.experiences?.length) {
    children.push(heading('Work Experience'));
    for (const exp of content.experiences) {
      const dateStr = exp.current
        ? `${exp.startDate} – Present`
        : [exp.startDate, exp.endDate].filter(Boolean).join(' – ');

      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.position || '', bold: true, size: 24 }),
            new TextRun({ text: exp.company ? `  ·  ${exp.company}` : '', size: 22, color: '4F46E5' }),
            new TextRun({ text: dateStr ? `   ${dateStr}` : '', size: 20, color: '888888' }),
          ],
          spacing: { before: 120, after: 60 },
        }),
      );

      if (exp.location) children.push(body(`📍 ${exp.location}`));
      if (exp.description) {
        exp.description.split(/\n|•/).filter(Boolean).forEach((line) => {
          children.push(bulletPoint(line.trim()));
        });
      }
    }
  }

  // ── Education ──────────────────────────────────────────────────────────────
  if (content.educations?.length) {
    children.push(heading('Education'));
    for (const edu of content.educations) {
      const dateStr = [edu.startDate, edu.endDate].filter(Boolean).join(' – ');
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.degree || '', bold: true, size: 24 }),
            new TextRun({ text: edu.field ? ` in ${edu.field}` : '', size: 22 }),
            new TextRun({ text: edu.institution ? `  ·  ${edu.institution}` : '', size: 22, color: '4F46E5' }),
            new TextRun({ text: dateStr ? `   ${dateStr}` : '', size: 20, color: '888888' }),
          ],
          spacing: { before: 120, after: 60 },
        }),
      );
      if (edu.grade) children.push(body(`Grade: ${edu.grade}`));
    }
  }

  // ── Skills ────────────────────────────────────────────────────────────────
  if (content.skills?.length) {
    children.push(heading('Skills'));
    // Group by category
    const byCategory: Record<string, string[]> = {};
    for (const s of content.skills) {
      const cat = s.category || 'General';
      if (!byCategory[cat]) byCategory[cat] = [];
      byCategory[cat].push(s.name);
    }
    for (const [cat, names] of Object.entries(byCategory)) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${cat}: `, bold: true, size: 22 }),
            new TextRun({ text: names.join(', '), size: 22 }),
          ],
          spacing: { after: 60 },
        }),
      );
    }
  }

  // ── Projects ──────────────────────────────────────────────────────────────
  if (content.projects?.length) {
    children.push(heading('Projects'));
    for (const proj of content.projects) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: proj.title || '', bold: true, size: 24 })],
          spacing: { before: 100, after: 40 },
        }),
      );
      if (proj.technologies) {
        children.push(body(`Tech: ${proj.technologies}`));
      }
      if (proj.description) {
        proj.description.split(/\n|•/).filter(Boolean).forEach((line) => {
          children.push(bulletPoint(line.trim()));
        });
      }
      if (proj.url) children.push(body(`🔗 ${proj.url}`));
    }
  }

  // ── Certifications ────────────────────────────────────────────────────────
  if (content.certifications?.length) {
    children.push(heading('Certifications'));
    for (const cert of content.certifications) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: cert.name || '', bold: true, size: 22 }),
            new TextRun({ text: cert.issuer ? `  ·  ${cert.issuer}` : '', size: 20, color: '555555' }),
            new TextRun({ text: cert.date ? `   ${cert.date}` : '', size: 20, color: '888888' }),
          ],
          spacing: { after: 60 },
        }),
      );
    }
  }

  // ── Languages ─────────────────────────────────────────────────────────────
  if (content.languages?.length) {
    children.push(heading('Languages'));
    children.push(
      new Paragraph({
        children: content.languages.map((l, i) =>
          new TextRun({
            text: `${l.name}${l.proficiency ? ` (${l.proficiency})` : ''}${i < (content.languages?.length ?? 0) - 1 ? '   ·   ' : ''}`,
            size: 22,
          }),
        ),
        spacing: { after: 60 },
      }),
    );
  }

  // ── Build & save ──────────────────────────────────────────────────────────
  const doc = new Document({
    creator: 'CareerCraft',
    title: cvTitle,
    description: 'Resume generated by CareerCraft',
    sections: [
      {
        properties: {
          page: {
            size: { width: 12240, height: 15840 }, // A4 in twips (1/1440 inch)
            margin: { top: 720, right: 720, bottom: 720, left: 720 }, // 0.5 inch
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
}
