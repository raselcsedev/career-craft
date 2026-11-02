/**
 * CvParserService
 * ---------------
 * Accepts a raw file buffer (PDF or DOCX) and converts it into a structured
 * CvContent object that the frontend can use to pre-populate the CV editor.
 *
 * HOW IT WORKS (beginner-friendly explanation):
 *  1. We read the bytes of the uploaded file.
 *  2. Depending on the file type we extract plain text:
 *     - PDF  → pdf-parse library scans each page and stitches text together.
 *     - DOCX → mammoth library converts Word XML into raw text.
 *  3. We split the text into lines and walk through them applying simple
 *     rules (regex patterns + section headings) to group information into
 *     known buckets: personalInfo, summary, experiences, educations, skills, …
 *  4. We return a plain JS object – not saved to DB here. The controller
 *     forwards it to the frontend so the user can review before saving.
 */

import { Injectable, BadRequestException } from '@nestjs/common';

// ── Type mirrors the frontend CvContent interface ─────────────────────────────
export interface ParsedCvContent {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    linkedin: string;
    github: string;
    jobTitle: string;
  };
  summary: string;
  experiences: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    location: string;
  }>;
  educations: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa: string;
    description: string;
  }>;
  skills: Array<{ name: string; level: string; category: string }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    url: string;
    startDate: string;
    endDate: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    url: string;
  }>;
  languages: Array<{ language: string; proficiency: string }>;
}

// ── Section heading detection ─────────────────────────────────────────────────
const SECTION_PATTERNS: Record<string, RegExp> = {
  summary: /^(summary|objective|professional\s+summary|about\s+me|profile|career\s+objective)/i,
  experience: /^(experience|work\s+(experience|history)|employment|professional\s+experience|career\s+history)/i,
  education: /^(education|academic|qualifications?|academic\s+background)/i,
  skills: /^(skills?|technical\s+skills?|core\s+competencies|technologies|tools?|expertise)/i,
  projects: /^(projects?|personal\s+projects?|key\s+projects?|portfolio)/i,
  certifications: /^(certifications?|certificates?|credentials?|licenses?|awards?|achievements?)/i,
  languages: /^(languages?|language\s+skills?)/i,
};

function detectSection(line: string): string | null {
  const trimmed = line.trim().replace(/[:\-–—]+$/, '').trim();
  for (const [section, pattern] of Object.entries(SECTION_PATTERNS)) {
    if (pattern.test(trimmed)) return section;
  }
  return null;
}

// ── Contact info extractors ───────────────────────────────────────────────────
function extractEmail(text: string): string {
  const m = text.match(/[\w.+\-]+@[\w\-]+\.[\w.]+/);
  return m ? m[0] : '';
}

function extractPhone(text: string): string {
  const m = text.match(/(\+?\d[\d\s.\-()]{7,}\d)/);
  return m ? m[1].trim() : '';
}

function extractLinkedin(text: string): string {
  const m = text.match(/linkedin\.com\/in\/[\w\-]+/i);
  return m ? `https://${m[0]}` : '';
}

function extractGithub(text: string): string {
  const m = text.match(/github\.com\/[\w\-]+/i);
  return m ? `https://${m[0]}` : '';
}

function extractWebsite(text: string): string {
  const m = text.match(/https?:\/\/(?!linkedin|github)[^\s]+/i);
  return m ? m[0] : '';
}

// ── Date helpers ──────────────────────────────────────────────────────────────
function extractDates(line: string): { start: string; end: string; current: boolean } {
  const current = /present|current|now/i.test(line);
  // Matches patterns like "Jan 2020 – Mar 2023" or "2018-2021"
  const dateRange = line.match(
    /(\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)?\.?\s*\d{4})\s*[-–—to]+\s*(present|current|\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)?\.?\s*\d{4})/i,
  );
  if (dateRange) {
    return { start: dateRange[1].trim(), end: current ? '' : dateRange[2].trim(), current };
  }
  return { start: '', end: '', current };
}

// ── Main parser class ─────────────────────────────────────────────────────────
@Injectable()
export class CvParserService {
  /**
   * Parse a file buffer and return structured CV content.
   * @param buffer   Raw bytes of the uploaded file.
   * @param mimeType MIME type string (application/pdf or application/vnd.openxmlformats…).
   */
  async parseDocument(buffer: Buffer, mimeType: string): Promise<ParsedCvContent> {
    let rawText = '';

    if (mimeType === 'application/pdf') {
      rawText = await this.extractPdfText(buffer);
    } else if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      mimeType === 'application/msword'
    ) {
      rawText = await this.extractDocxText(buffer);
    } else {
      throw new BadRequestException(
        `Unsupported file type: ${mimeType}. Please upload a PDF or DOCX file.`,
      );
    }

    return this.parseText(rawText);
  }

  // ── PDF extraction ──────────────────────────────────────────────────────────
  private async extractPdfText(buffer: Buffer): Promise<string> {
    try {
      // pdf-parse is a CommonJS module so we use require() to avoid ESM issues
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const pdfParse = require('pdf-parse');
      const data = await pdfParse(buffer);
      return data.text || '';
    } catch (err: any) {
      throw new BadRequestException(`Could not read PDF file: ${err.message}`);
    }
  }

  // ── DOCX extraction ─────────────────────────────────────────────────────────
  private async extractDocxText(buffer: Buffer): Promise<string> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const mammoth = require('mammoth');
      const result = await mammoth.extractRawText({ buffer });
      return result.value || '';
    } catch (err: any) {
      throw new BadRequestException(`Could not read DOCX file: ${err.message}`);
    }
  }

  // ── Text → CvContent parser ─────────────────────────────────────────────────
  private parseText(text: string): ParsedCvContent {
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    // ---- Personal info: scan first 20 lines ----
    const headerBlock = lines.slice(0, 20).join('\n');
    const email = extractEmail(headerBlock);
    const phone = extractPhone(headerBlock);
    const linkedin = extractLinkedin(headerBlock);
    const github = extractGithub(headerBlock);
    const website = extractWebsite(headerBlock);

    // Name is usually the very first non-empty line (before we hit an email/phone)
    let fullName = '';
    for (const line of lines.slice(0, 5)) {
      if (
        !extractEmail(line) &&
        !extractPhone(line) &&
        !/^https?:\/\//i.test(line) &&
        line.length > 2 &&
        line.length < 60
      ) {
        fullName = line;
        break;
      }
    }

    // Job title: look for a line after the name that looks like a title
    let jobTitle = '';
    const nameIdx = lines.indexOf(fullName);
    if (nameIdx >= 0 && nameIdx + 1 < lines.length) {
      const candidate = lines[nameIdx + 1];
      if (
        !extractEmail(candidate) &&
        !extractPhone(candidate) &&
        !/^https?:\/\//i.test(candidate) &&
        candidate.length < 80
      ) {
        jobTitle = candidate;
      }
    }

    // Location: look for city/country pattern
    let location = '';
    for (const line of lines.slice(0, 15)) {
      if (/\b[A-Z][a-z]+(?:,\s*[A-Z][a-zA-Z\s]+)?\b/.test(line) && line.length < 50 && !extractEmail(line) && !extractPhone(line)) {
        // simple heuristic – if it's short and contains title-case words, it's likely a city
        if (/,/.test(line) || /\b(city|state|country|remote)\b/i.test(line)) {
          location = line;
          break;
        }
      }
    }

    // ---- Section grouping ----
    type SectionName = 'header' | 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'languages';
    const sections: Record<SectionName, string[]> = {
      header: [],
      summary: [],
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      languages: [],
    };
    let currentSection: SectionName = 'header';

    for (const line of lines) {
      const detected = detectSection(line) as SectionName | null;
      if (detected) {
        currentSection = detected;
        continue;
      }
      sections[currentSection].push(line);
    }

    // ---- Parse summary ----
    const summary = sections.summary.join(' ').trim();

    // ---- Parse experiences ----
    const experiences = this.parseExperiences(sections.experience);

    // ---- Parse educations ----
    const educations = this.parseEducations(sections.education);

    // ---- Parse skills ----
    const skills = this.parseSkills(sections.skills);

    // ---- Parse projects ----
    const projects = this.parseProjects(sections.projects);

    // ---- Parse certifications ----
    const certifications = this.parseCertifications(sections.certifications);

    // ---- Parse languages ----
    const languages = this.parseLanguages(sections.languages);

    return {
      personalInfo: { fullName, email, phone, location, website, linkedin, github, jobTitle },
      summary,
      experiences,
      educations,
      skills,
      projects,
      certifications,
      languages,
    };
  }

  // ── Experience parser ─────────────────────────────────────────────────────
  private parseExperiences(lines: string[]) {
    const experiences: ParsedCvContent['experiences'] = [];
    if (!lines.length) return experiences;

    let current: (typeof experiences)[0] | null = null;
    const descLines: string[] = [];

    const flushCurrent = () => {
      if (current) {
        current.description = descLines.join(' ').trim();
        experiences.push({ ...current });
        descLines.length = 0;
      }
    };

    for (const line of lines) {
      const dates = extractDates(line);
      // A new job entry typically contains a date range
      if (dates.start || /\b(19|20)\d{2}\b/.test(line)) {
        flushCurrent();
        // Try to extract company and position from this line or the previous
        const parts = line.split(/[-–—|•·]/);
        current = {
          company: parts[0]?.trim() || '',
          position: parts[1]?.trim() || '',
          startDate: dates.start,
          endDate: dates.end,
          current: dates.current,
          description: '',
          location: '',
        };
      } else if (current) {
        descLines.push(line);
      }
    }
    flushCurrent();
    return experiences;
  }

  // ── Education parser ──────────────────────────────────────────────────────
  private parseEducations(lines: string[]) {
    const educations: ParsedCvContent['educations'] = [];
    if (!lines.length) return educations;

    let current: (typeof educations)[0] | null = null;
    const descLines: string[] = [];

    const flushCurrent = () => {
      if (current) {
        current.description = descLines.join(' ').trim();
        educations.push({ ...current });
        descLines.length = 0;
      }
    };

    for (const line of lines) {
      const dates = extractDates(line);
      const hasDegreeWord = /\b(bachelor|master|phd|doctorate|diploma|associate|b\.?s\.?c?|m\.?s\.?c?|b\.?a\.?|m\.?a\.?|m\.?eng|beng|mba)\b/i.test(line);

      if (hasDegreeWord || dates.start) {
        flushCurrent();
        const parts = line.split(/[-–—|,]/);
        // Try to split degree + institution
        const degreeMatch = line.match(/(bachelor|master|phd|doctorate|diploma|associate|b\.?s\.?c?|m\.?s\.?c?|b\.?a\.?|m\.?a\.?|m\.?eng|beng|mba)[^,\n]*/i);
        current = {
          institution: parts[0]?.trim() || '',
          degree: degreeMatch ? degreeMatch[0].trim() : (parts[1]?.trim() || ''),
          field: parts[2]?.trim() || '',
          startDate: dates.start,
          endDate: dates.end,
          gpa: '',
          description: '',
        };
        // GPA
        const gpaMatch = line.match(/gpa[:\s]+(\d+\.?\d*)/i);
        if (gpaMatch) current.gpa = gpaMatch[1];
      } else if (current) {
        descLines.push(line);
      }
    }
    flushCurrent();
    return educations;
  }

  // ── Skills parser ─────────────────────────────────────────────────────────
  private parseSkills(lines: string[]) {
    const skills: ParsedCvContent['skills'] = [];
    const allText = lines.join(', ');
    // Split on common delimiters
    const items = allText.split(/[,|•·\n]+/).map((s) => s.trim()).filter((s) => s.length > 1 && s.length < 50);
    for (const item of items) {
      // Skip lines that look like section sub-headings (all uppercase or very long)
      if (item === item.toUpperCase() && item.length > 20) continue;
      skills.push({ name: item, level: 'Intermediate', category: 'General' });
    }
    return skills.slice(0, 30); // cap at 30
  }

  // ── Projects parser ───────────────────────────────────────────────────────
  private parseProjects(lines: string[]) {
    const projects: ParsedCvContent['projects'] = [];
    if (!lines.length) return projects;

    let current: (typeof projects)[0] | null = null;
    const descLines: string[] = [];

    const flushCurrent = () => {
      if (current) {
        current.description = descLines.join(' ').trim();
        projects.push({ ...current });
        descLines.length = 0;
      }
    };

    for (const line of lines) {
      // New project: short line (< 80 chars) that doesn't look like a description sentence
      const isProjectTitle = line.length < 80 && !line.startsWith('-') && !line.startsWith('•') && !/^\d+\./.test(line);
      if (isProjectTitle && current === null) {
        current = { name: line, description: '', technologies: [], url: '', startDate: '', endDate: '' };
      } else if (isProjectTitle && current && current.description) {
        // new project block
        flushCurrent();
        current = { name: line, description: '', technologies: [], url: '', startDate: '', endDate: '' };
      } else if (current) {
        // pick up URL
        const urlMatch = line.match(/https?:\/\/[^\s]+/);
        if (urlMatch) current.url = urlMatch[0];
        // pick up technologies if listed
        if (/tech(nologies|nology|\.)?|built\s+with|stack/i.test(line)) {
          current.technologies = line.replace(/tech(nologies|nology|\.)?|built\s+with|stack/i, '').split(/[,|]+/).map((t) => t.trim()).filter(Boolean);
        } else {
          descLines.push(line);
        }
      }
    }
    flushCurrent();
    return projects;
  }

  // ── Certifications parser ─────────────────────────────────────────────────
  private parseCertifications(lines: string[]) {
    const certifications: ParsedCvContent['certifications'] = [];
    for (const line of lines) {
      if (!line.trim()) continue;
      const parts = line.split(/[-–—|,]/);
      certifications.push({
        name: parts[0]?.trim() || line,
        issuer: parts[1]?.trim() || '',
        date: parts[2]?.trim() || '',
        url: '',
      });
    }
    return certifications;
  }

  // ── Languages parser ──────────────────────────────────────────────────────
  private parseLanguages(lines: string[]) {
    const languages: ParsedCvContent['languages'] = [];
    for (const line of lines) {
      if (!line.trim()) continue;
      const parts = line.split(/[-–—|,:(]/);
      languages.push({
        language: parts[0]?.trim() || line,
        proficiency: parts[1]?.trim() || 'Conversational',
      });
    }
    return languages;
  }
}
