'use client';

import React from 'react';
import { CvContent, CvStyling } from '@/types/cv';

interface TemplateProps {
  content: CvContent;
  styling?: CvStyling;
}

export function MinimalClean({ content, styling }: TemplateProps) {
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

  const primaryColor = styling?.primaryColor || '#18181b'; // zinc-900 / minimal
  const fontClass =
    styling?.fontFamily === 'Merriweather'
      ? 'font-serif'
      : styling?.fontFamily === 'Fira Code'
      ? 'font-mono'
      : 'font-sans';

  return (
    <div
      className={`w-full bg-white text-zinc-800 p-8 sm:p-12 shadow-sm print:shadow-none print:p-0 min-h-[297mm] ${fontClass}`}
    >
      {/* Header — minimalist, clean, generous whitespace */}
      <header className="mb-10 pb-6 border-b border-zinc-200">
        <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-zinc-950">
          {personalInfo.fullName || 'Your Full Name'}
        </h1>
        {personalInfo.headline && (
          <p className="text-sm tracking-wide text-zinc-500 font-normal mt-1">
            {personalInfo.headline}
          </p>
        )}

        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-4 text-xs text-zinc-500 font-light">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {(personalInfo.city || personalInfo.country) && (
            <span>• {[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}</span>
          )}
          {personalInfo.website && (
            <span>
              •{' '}
              <a href={personalInfo.website} target="_blank" rel="noreferrer" className="underline hover:text-zinc-900">
                {personalInfo.website.replace(/^https?:\/\//, '')}
              </a>
            </span>
          )}
          {personalInfo.linkedin && (
            <span>
              •{' '}
              <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="underline hover:text-zinc-900">
                LinkedIn
              </a>
            </span>
          )}
          {personalInfo.github && (
            <span>
              •{' '}
              <a href={personalInfo.github} target="_blank" rel="noreferrer" className="underline hover:text-zinc-900">
                GitHub
              </a>
            </span>
          )}
        </div>
      </header>

      {/* Grid Content with subtle left labels */}
      <div className="space-y-8">
        {/* Summary */}
        {summary && (
          <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <h2 className="text-xs font-semibold tracking-wider uppercase text-zinc-400">About</h2>
            <div className="md:col-span-3">
              <p className="text-sm text-zinc-700 leading-relaxed font-light">{summary}</p>
            </div>
          </section>
        )}

        {/* Experience */}
        {experiences && experiences.length > 0 && (
          <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <h2 className="text-xs font-semibold tracking-wider uppercase text-zinc-400">
              Experience
            </h2>
            <div className="md:col-span-3 space-y-6">
              {experiences.map((exp) => (
                <div key={exp.id} className="space-y-1 text-sm">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                    <span className="font-medium text-zinc-900">{exp.position}</span>
                    <span className="text-xs text-zinc-400 font-mono">
                      {exp.startDate} — {exp.current ? 'Present' : exp.endDate || 'Present'}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-500">
                    {exp.company} {exp.location && `, ${exp.location}`}
                  </div>
                  {exp.description && (
                    <p className="text-xs text-zinc-600 leading-relaxed pt-1 font-light whitespace-pre-line">
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
          <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <h2 className="text-xs font-semibold tracking-wider uppercase text-zinc-400">
              Education
            </h2>
            <div className="md:col-span-3 space-y-4">
              {educations.map((edu) => (
                <div key={edu.id} className="space-y-0.5 text-sm">
                  <div className="flex justify-between items-baseline">
                    <span className="font-medium text-zinc-900">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </span>
                    <span className="text-xs text-zinc-400 font-mono">
                      {edu.startDate} — {edu.endDate || 'Present'}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-500">
                    {edu.institution} {edu.grade && `• GPA: ${edu.grade}`}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <h2 className="text-xs font-semibold tracking-wider uppercase text-zinc-400">Skills</h2>
            <div className="md:col-span-3">
              <p className="text-sm text-zinc-700 leading-relaxed font-light">
                {skills.map((s) => s.name).join('  •  ')}
              </p>
            </div>
          </section>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <h2 className="text-xs font-semibold tracking-wider uppercase text-zinc-400">
              Projects
            </h2>
            <div className="md:col-span-3 space-y-4">
              {projects.map((proj) => (
                <div key={proj.id} className="space-y-0.5 text-sm">
                  <div className="flex items-baseline justify-between">
                    <span className="font-medium text-zinc-900">{proj.title}</span>
                    {proj.url && (
                      <a
                        href={proj.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-zinc-500 underline hover:text-zinc-900"
                      >
                        link
                      </a>
                    )}
                  </div>
                  {proj.technologies && (
                    <div className="text-xs text-zinc-400 font-mono">{proj.technologies}</div>
                  )}
                  {proj.description && (
                    <p className="text-xs text-zinc-600 font-light leading-relaxed pt-0.5">
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
          <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <h2 className="text-xs font-semibold tracking-wider uppercase text-zinc-400">Other</h2>
            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {certifications && certifications.length > 0 && (
                <div>
                  <h3 className="font-medium text-zinc-900 mb-1">Certifications</h3>
                  <ul className="space-y-1 text-zinc-600 font-light">
                    {certifications.map((c) => (
                      <li key={c.id}>
                        {c.name} — {c.issuer}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {languages && languages.length > 0 && (
                <div>
                  <h3 className="font-medium text-zinc-900 mb-1">Languages</h3>
                  <ul className="space-y-1 text-zinc-600 font-light">
                    {languages.map((l) => (
                      <li key={l.id}>
                        {l.name} ({l.proficiency})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
