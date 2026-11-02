/**
 * cv-download.ts
 * ──────────────
 * Clean browser downloads for CV documents:
 *
 *  1. downloadCvAsPdf(elementId, filename)
 *     - Uses html-to-image (SVG foreignObject) so it natively supports
 *       Tailwind v4's oklab()/oklch() color functions without parser errors.
 *     - Slices the captured canvas into exact A4 pages (210mm × 297mm).
 *     - Ensures zero cut off on left, right, top, or bottom.
 *
 *  2. downloadCvAsDocx(content, title, filename)
 *     - Builds a structured Word .docx document using docx.
 *     - Uses pure HTML5 anchor blob download (no file-saver ESM issues).
 */

import type { CvContent } from '@/types/cv';

// ── Standard A4 dimensions ────────────────────────────────────────────────────
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

// ── Native Browser Blob Downloader (replaces fragile file-saver) ───────────────
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ── PDF Download (oklab-safe via html-to-image) ────────────────────────────────
export async function downloadCvAsPdf(
  previewElementId: string,
  filename = 'resume.pdf',
): Promise<void> {
  const [{ toJpeg }, { default: jsPDF }] = await Promise.all([
    import('html-to-image'),
    import('jspdf'),
  ]);

  const element = document.getElementById(previewElementId);
  if (!element) {
    throw new Error(`Element #${previewElementId} not found in the DOM`);
  }

  // Find the CV template element itself (inner clean white page)
  const cvPage = (element.querySelector<HTMLElement>('.cv-printable-page') || element);

  // Capture using html-to-image which natively renders all modern CSS
  // (oklab, oklch, modern fonts, flexbox/grid) through browser foreignObject
  const dataUrl = await toJpeg(cvPage, {
    quality: 0.98,
    backgroundColor: '#ffffff',
    pixelRatio: 2, // 2x DPI for ultra-crisp text rendering
    cacheBust: true,
  });

  // Load into Image to calculate exact dimensions
  const img = new Image();
  img.src = dataUrl;
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('Failed to rasterize CV preview image'));
  });

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const imgWidthPx = img.width;
  const imgHeightPx = img.height;

  // Exact pixel height that corresponds to 297mm on an A4 sheet at this width
  const pageHeightPx = (A4_HEIGHT_MM / A4_WIDTH_MM) * imgWidthPx;
  const totalPages = Math.max(1, Math.ceil(imgHeightPx / pageHeightPx));

  for (let page = 0; page < totalPages; page++) {
    if (page > 0) pdf.addPage();

    const sliceCanvas = document.createElement('canvas');
    sliceCanvas.width = imgWidthPx;
    sliceCanvas.height = pageHeightPx;

    const ctx = sliceCanvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);

      const sourceY = page * pageHeightPx;
      const sourceHeight = Math.min(pageHeightPx, imgHeightPx - sourceY);

      ctx.drawImage(
        img,
        0, sourceY, imgWidthPx, sourceHeight,
        0, 0, imgWidthPx, sourceHeight,
      );
    }

    const pageDataUrl = sliceCanvas.toDataURL('image/jpeg', 0.95);
    pdf.addImage(pageDataUrl, 'JPEG', 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM);
  }

  pdf.save(filename);
}

// ── DOCX Download ─────────────────────────────────────────────────────────────
export async function downloadCvAsDocx(
  content: CvContent,
  cvTitle = 'Resume',
  filename = 'resume.docx',
): Promise<void> {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, BorderStyle, AlignmentType } =
    await import('docx');

  const info = content.personalInfo || ({} as any);

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

  // Header: Name + Contact
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

  const locationStr = [info.city, info.country].filter(Boolean).join(', ');
  const contactParts = [
    info.email,
    info.phone,
    locationStr,
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

  // Summary
  if (content.summary) {
    children.push(heading('Professional Summary'));
    children.push(body(content.summary));
  }

  // Work Experience
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
        exp.description
          .split(/\n|•/)
          .filter(Boolean)
          .forEach((line) => {
            children.push(bulletPoint(line.trim()));
          });
      }
    }
  }

  // Education
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

  // Skills
  if (content.skills?.length) {
    children.push(heading('Skills'));
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

  // Key Projects
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
        proj.description
          .split(/\n|•/)
          .filter(Boolean)
          .forEach((line) => {
            children.push(bulletPoint(line.trim()));
          });
      }
      if (proj.url) children.push(body(`🔗 ${proj.url}`));
    }
  }

  // Certifications
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

  // Languages
  if (content.languages?.length) {
    children.push(heading('Languages'));
    children.push(
      new Paragraph({
        children: content.languages.map((l, i) =>
          new TextRun({
            text: `${l.name}${l.proficiency ? ` (${l.proficiency})` : ''}${
              i < (content.languages?.length ?? 0) - 1 ? '   ·   ' : ''
            }`,
            size: 22,
          }),
        ),
        spacing: { after: 60 },
      }),
    );
  }

  // Assemble document
  const doc = new Document({
    creator: 'CareerCraft',
    title: cvTitle,
    description: 'Resume generated by CareerCraft',
    sections: [
      {
        properties: {
          page: {
            size: { width: 12240, height: 15840 }, // A4 twips
            margin: { top: 720, right: 720, bottom: 720, left: 720 }, // 0.5 in
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, filename);
}
