'use client';

import React from 'react';
import { CvContent, CvStyling } from '@/types/cv';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/ui/Icons';

interface TemplateProps {
  content: CvContent;
  styling?: CvStyling;
}

export function ClassicProfessional({ content, styling }: TemplateProps) {
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

  const primaryColor = styling?.primaryColor || '#1e3a8a'; // deep navy/classic
  const fontClass =
    styling?.fontFamily === 'Merriweather'
      ? 'font-serif'
      : styling?.fontFamily === 'Fira Code'
      ? 'font-mono'
      : 'font-sans';

  return (
    <div
      className={`w-full bg-white text-gray-800 p-8 sm:p-10 shadow-sm print:shadow-none print:p-0 ${fontClass}`}
      style={{ minHeight: '297mm' }}
    >
      {/* Header */}
      <header className="border-b-2 pb-5 text-center" style={{ borderColor: primaryColor }}>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 uppercase">
          {personalInfo.fullName || 'Your Full Name'}
        </h1>
        {personalInfo.headline && (
          <p className="text-lg font-medium mt-1" style={{ color: primaryColor }}>
            {personalInfo.headline}
          </p>
        )}

        {/* Contact details */}
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
          {personalInfo.linkedin && (
            <span className="flex items-center gap-1">
              <LinkedinIcon className="w-3.5 h-3.5" />
              {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
            </span>
          )}
          {personalInfo.github && (
            <span className="flex items-center gap-1">
              <GithubIcon className="w-3.5 h-3.5" />
              {personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
            </span>
          )}
        </div>
      </header>

      {/* Main Content Body */}
      <div className="mt-6 space-y-6">
        {/* Professional Summary */}
        {summary && (
          <section>
            <h2
              className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-2.5"
              style={{ color: primaryColor, borderColor: '#e5e7eb' }}
            >
              Professional Summary
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{summary}</p>
          </section>
        )}

        {/* Work Experience */}
        {experiences && experiences.length > 0 && (
          <section>
            <h2
              className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-3"
              style={{ color: primaryColor, borderColor: '#e5e7eb' }}
            >
              Work Experience
            </h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="text-sm">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                    <span className="font-semibold text-gray-900">{exp.position}</span>
                    <span className="text-xs text-gray-500 font-medium">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate || 'Present'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1.5 italic">
                    <span>{exp.company}</span>
                    {exp.location && <span>{exp.location}</span>}
                  </div>
                  {exp.description && (
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {educations && educations.length > 0 && (
          <section>
            <h2
              className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-3"
              style={{ color: primaryColor, borderColor: '#e5e7eb' }}
            >
              Education
            </h2>
            <div className="space-y-3">
              {educations.map((edu) => (
                <div key={edu.id} className="text-sm">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                    <span className="font-semibold text-gray-900">
                      {edu.degree} {edu.field ? `in ${edu.field}` : ''}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      {edu.startDate} – {edu.endDate || 'Present'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>{edu.institution}</span>
                    {edu.grade && <span className="font-medium text-gray-700">GPA: {edu.grade}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <section>
            <h2
              className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-2.5"
              style={{ color: primaryColor, borderColor: '#e5e7eb' }}
            >
              Skills & Expertise
            </h2>
            <div className="flex flex-wrap gap-2 text-xs">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className="px-2.5 py-1 bg-gray-100 text-gray-800 rounded font-medium border border-gray-200"
                >
                  {skill.name} {skill.level ? `(${skill.level})` : ''}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section>
            <h2
              className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-3"
              style={{ color: primaryColor, borderColor: '#e5e7eb' }}
            >
              Key Projects
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
                        {proj.url.replace(/^https?:\/\//, '')}
                      </a>
                    )}
                  </div>
                  {proj.technologies && (
                    <p className="text-xs text-gray-500 font-medium mb-1">
                      Tech stack: {proj.technologies}
                    </p>
                  )}
                  {proj.description && (
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                      {proj.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications & Languages */}
        {((certifications && certifications.length > 0) || (languages && languages.length > 0)) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {certifications && certifications.length > 0 && (
              <section>
                <h2
                  className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-2"
                  style={{ color: primaryColor, borderColor: '#e5e7eb' }}
                >
                  Certifications
                </h2>
                <ul className="space-y-1 text-xs text-gray-700">
                  {certifications.map((c) => (
                    <li key={c.id}>
                      <span className="font-semibold">{c.name}</span> — {c.issuer} {c.date && `(${c.date})`}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {languages && languages.length > 0 && (
              <section>
                <h2
                  className="text-sm font-bold uppercase tracking-wider border-b pb-1 mb-2"
                  style={{ color: primaryColor, borderColor: '#e5e7eb' }}
                >
                  Languages
                </h2>
                <ul className="space-y-1 text-xs text-gray-700">
                  {languages.map((l) => (
                    <li key={l.id}>
                      <span className="font-semibold">{l.name}</span>: {l.proficiency}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
