'use client';

import React from 'react';
import { CvContent, CvStyling } from '@/types/cv';
import { Terminal, Globe, Mail, Phone, MapPin, ExternalLink, Code } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/ui/Icons';

interface TemplateProps {
  content: CvContent;
  styling?: CvStyling;
}

export function DeveloperTechnical({ content, styling }: TemplateProps) {
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

  const primaryColor = styling?.primaryColor || '#0284c7'; // sky-600 / developer blue

  return (
    <div
      className="w-full bg-white text-slate-800 p-8 sm:p-10 shadow-sm print:shadow-none min-h-[297mm] font-sans"
    >
      {/* Terminal Style Header */}
      <div className="border border-slate-200 rounded-xl overflow-hidden mb-6 shadow-xs">
        <div className="bg-slate-900 px-4 py-2.5 flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
            <span className="ml-2 text-slate-300">resume.sh — bash — 80x24</span>
          </div>
          <div className="flex items-center gap-1.5 text-sky-400">
            <Terminal className="w-3.5 h-3.5" />
            <span>Developer Profile</span>
          </div>
        </div>

        <div className="p-6 bg-slate-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
          <div>
            <div className="text-xs text-sky-400 mb-1">$ whoami</div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {personalInfo.fullName || 'developer'}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              // {personalInfo.headline || 'Full Stack Engineer'}
            </p>
          </div>

          <div className="flex flex-col gap-1.5 text-xs text-slate-300">
            {personalInfo.email && (
              <span className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-sky-400" />
                {personalInfo.email}
              </span>
            )}
            {personalInfo.github && (
              <a
                href={`https://${personalInfo.github.replace(/^https?:\/\//, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sky-300 hover:underline"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                {personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, 'gh/')}
              </a>
            )}
            {personalInfo.website && (
              <a
                href={personalInfo.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sky-300 hover:underline"
              >
                <Globe className="w-3.5 h-3.5" />
                {personalInfo.website.replace(/^https?:\/\//, '')}
              </a>
            )}
            {(personalInfo.city || personalInfo.country) && (
              <span className="flex items-center gap-2 text-slate-400">
                <MapPin className="w-3.5 h-3.5" />
                {[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="space-y-6">
        {/* Summary */}
        {summary && (
          <section>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <span className="text-sky-600 font-bold">#</span> 01_SUMMARY
            </h2>
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-lg text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
              {summary}
            </div>
          </section>
        )}

        {/* Technical Stack / Skills */}
        {skills && skills.length > 0 && (
          <section>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
              <span className="text-sky-600 font-bold">#</span> 02_TECH_STACK
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200/80 border border-slate-300 rounded font-mono text-xs text-slate-800 transition-colors"
                >
                  <code className="text-sky-700 font-semibold">&lt;</code>
                  {skill.name}
                  <code className="text-sky-700 font-semibold">/&gt;</code>
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {experiences && experiences.length > 0 && (
          <section>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <span className="text-sky-600 font-bold">#</span> 03_WORK_HISTORY
            </h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="border-l-2 border-sky-500 pl-4 py-0.5">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                    <span className="font-bold text-slate-900 text-sm">{exp.position}</span>
                    <span className="text-xs font-mono text-slate-500">
                      {exp.startDate} → {exp.current ? 'CURRENT' : exp.endDate || 'PRESENT'}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-sky-700 font-medium mb-1.5">
                    @ {exp.company} {exp.location && `[${exp.location}]`}
                  </div>
                  {exp.description && (
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line font-sans">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <span className="text-sky-600 font-bold">#</span> 04_FEATURED_REPOSITORIES
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-3.5 border border-slate-200 rounded-lg bg-white shadow-2xs hover:shadow-xs transition-shadow"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <Code className="w-3.5 h-3.5 text-sky-600" />
                      {proj.title}
                    </span>
                    {proj.url && (
                      <a
                        href={proj.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-sky-600"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  {proj.technologies && (
                    <div className="text-[11px] font-mono text-slate-500 mb-1.5">
                      [{proj.technologies}]
                    </div>
                  )}
                  {proj.description && (
                    <p className="text-xs text-slate-600 leading-relaxed font-sans">
                      {proj.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education & Certs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {educations && educations.length > 0 && (
            <div>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-2">
                # 05_EDUCATION
              </h2>
              <div className="space-y-2 text-xs">
                {educations.map((edu) => (
                  <div key={edu.id} className="p-2.5 bg-slate-50 rounded border border-slate-200">
                    <div className="font-bold text-slate-900">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </div>
                    <div className="text-slate-600">{edu.institution}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {edu.startDate} – {edu.endDate || 'Present'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {certifications && certifications.length > 0 && (
            <div>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 mb-2">
                # 06_CREDENTIALS
              </h2>
              <div className="space-y-2 text-xs">
                {certifications.map((c) => (
                  <div key={c.id} className="p-2.5 bg-slate-50 rounded border border-slate-200">
                    <div className="font-bold text-slate-900">{c.name}</div>
                    <div className="text-slate-600">{c.issuer} {c.date && `(${c.date})`}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
