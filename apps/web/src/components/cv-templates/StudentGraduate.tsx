'use client';

import React from 'react';
import { CvContent, CvStyling } from '@/types/cv';
import { Mail, Phone, MapPin, Globe, GraduationCap, Award, BookOpen, Briefcase } from 'lucide-react';

interface TemplateProps {
  content: CvContent;
  styling?: CvStyling;
}

export function StudentGraduate({ content, styling }: TemplateProps) {
  const {
    personalInfo = { fullName: '', headline: '', email: '', phone: '', city: '', country: '' },
    summary = '',
    experiences = [],
    educations = [],
    skills = [],
    projects = [],
    certifications = [],
    languages = [],
  } = content;

  const primaryColor = styling?.primaryColor || '#7c3aed'; // violet-600 / academic purple
  const fontClass =
    styling?.fontFamily === 'Merriweather'
      ? 'font-serif'
      : styling?.fontFamily === 'Fira Code'
      ? 'font-mono'
      : 'font-sans';

  return (
    <div
      className={`w-full bg-white text-gray-800 p-8 sm:p-10 shadow-sm print:shadow-none min-h-[297mm] ${fontClass}`}
    >
      {/* Header */}
      <header className="text-center pb-6 border-b border-gray-200">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          {personalInfo.fullName || 'Student Name'}
        </h1>
        <p className="text-base font-semibold mt-1" style={{ color: primaryColor }}>
          {personalInfo.headline || 'Recent Graduate / Aspiring Professional'}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-3 text-xs text-gray-600">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" />
              {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" />
              {personalInfo.phone}
            </span>
          )}
          {(personalInfo.city || personalInfo.country) && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}
            </span>
          )}
          {personalInfo.website && (
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" />
              {personalInfo.website.replace(/^https?:\/\//, '')}
            </span>
          )}
        </div>
      </header>

      {/* Main Content — Education is placed FIRST */}
      <div className="mt-6 space-y-6">
        {/* Objective / Summary */}
        {summary && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b-2 flex items-center gap-1.5"
              style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Academic Objective & Career Goals
            </h2>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{summary}</p>
          </section>
        )}

        {/* Education (Prominently at the top) */}
        {educations && educations.length > 0 && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b-2 flex items-center gap-1.5"
              style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Education & Academic Background
            </h2>
            <div className="space-y-3">
              {educations.map((edu) => (
                <div key={edu.id} className="p-3 bg-violet-50/50 rounded-lg border border-violet-100">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                    <span className="font-bold text-gray-900 text-sm">
                      {edu.degree} {edu.field ? `in ${edu.field}` : ''}
                    </span>
                    <span className="text-xs font-semibold text-violet-700">
                      {edu.startDate} – {edu.endDate || 'Expected'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 mt-0.5">
                    {edu.institution}
                    {edu.grade && (
                      <span className="ml-2 font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">
                        GPA: {edu.grade}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Academic & Personal Projects */}
        {projects && projects.length > 0 && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b-2"
              style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
            >
              Academic & Capstone Projects
            </h2>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id} className="text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">{proj.title}</span>
                    {proj.url && (
                      <a
                        href={proj.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs hover:underline"
                        style={{ color: primaryColor }}
                      >
                        Project Link
                      </a>
                    )}
                  </div>
                  {proj.technologies && (
                    <span className="text-xs text-gray-500 font-medium block">
                      Skills applied: {proj.technologies}
                    </span>
                  )}
                  {proj.description && (
                    <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                      {proj.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Internships & Work Experience */}
        {experiences && experiences.length > 0 && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b-2 flex items-center gap-1.5"
              style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
            >
              <Briefcase className="w-3.5 h-3.5" />
              Internships & Work Experience
            </h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="text-sm">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                    <span className="font-semibold text-gray-900">{exp.position}</span>
                    <span className="text-xs text-gray-500">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate || 'Present'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 italic mb-1">
                    {exp.company} {exp.location && `• ${exp.location}`}
                  </div>
                  {exp.description && (
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b-2"
              style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
            >
              Key Competencies & Technical Skills
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className="px-2.5 py-1 bg-gray-100 rounded-full text-xs font-medium text-gray-800"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Honors, Awards & Extracurriculars */}
        {certifications && certifications.length > 0 && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b-2 flex items-center gap-1.5"
              style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
            >
              <Award className="w-3.5 h-3.5" />
              Honors, Awards & Certifications
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {certifications.map((c) => (
                <div key={c.id} className="p-2 bg-gray-50 rounded">
                  <span className="font-semibold text-gray-900">{c.name}</span>
                  <div className="text-gray-500">{c.issuer} {c.date && `(${c.date})`}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
