'use client';

import React from 'react';
import { CvContent, CvStyling } from '@/types/cv';
import { Mail, Phone, MapPin, Globe, ExternalLink, Sparkles, Award } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/ui/Icons';

interface TemplateProps {
  content: CvContent;
  styling?: CvStyling;
}

export function ModernEdge({ content, styling }: TemplateProps) {
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

  const primaryColor = styling?.primaryColor || '#0ea5e9'; // sky-500 / modern tech edge
  const fontClass =
    styling?.fontFamily === 'Merriweather'
      ? 'font-serif'
      : styling?.fontFamily === 'Fira Code'
      ? 'font-mono'
      : 'font-sans';

  const parseBullets = (desc: string) => {
    if (!desc) return [];
    return desc
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => line.replace(/^[•\-\*]\s*/, ''));
  };

  return (
    <div
      className={`w-full bg-white text-slate-800 shadow-sm print:shadow-none min-h-[297mm] ${fontClass}`}
    >
      {/* Top Banner Accent */}
      <div
        className="h-2.5 w-full"
        style={{
          background: `linear-gradient(90deg, ${primaryColor} 0%, #6366f1 50%, #a855f7 100%)`,
        }}
      />

      <div className="p-8 sm:p-10">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-1.5 flex-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
              <Sparkles className="w-3 h-3 text-sky-500" />
              <span>Full-Stack &amp; Product Developer</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {personalInfo.fullName || 'Your Full Name'}
            </h1>
            {personalInfo.headline && (
              <p className="text-base font-semibold" style={{ color: primaryColor }}>
                {personalInfo.headline}
              </p>
            )}
          </div>

          {/* Contact Details Grid */}
          <div className="flex flex-col gap-1.5 text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200/80 min-w-[240px]">
            {personalInfo.email && (
              <span className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{personalInfo.email}</span>
              </span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{personalInfo.phone}</span>
              </span>
            )}
            {(personalInfo.city || personalInfo.country) && (
              <span className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}</span>
              </span>
            )}
            <div className="flex items-center gap-3 pt-1 border-t border-slate-200 mt-1">
              {personalInfo.linkedin && (
                <a
                  href={
                    personalInfo.linkedin.startsWith('http')
                      ? personalInfo.linkedin
                      : `https://${personalInfo.linkedin}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-500 hover:text-sky-600 transition-colors"
                >
                  <LinkedinIcon className="w-3.5 h-3.5" />
                </a>
              )}
              {personalInfo.github && (
                <a
                  href={
                    personalInfo.github.startsWith('http')
                      ? personalInfo.github
                      : `https://${personalInfo.github}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-500 hover:text-slate-900 transition-colors"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                </a>
              )}
              {personalInfo.website && (
                <a
                  href={
                    personalInfo.website.startsWith('http')
                      ? personalInfo.website
                      : `https://${personalInfo.website}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-500 hover:text-emerald-600 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </header>

        {/* 2-Column Split: Main Content (65%) & Sidebar (35%) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-6">
          {/* Main Column */}
          <div className="md:col-span-8 space-y-6">
            {/* Summary */}
            {summary && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 mb-2 pb-1 border-b border-slate-200">
                  <span
                    className="w-2 h-2 rounded-full inline-block"
                    style={{ backgroundColor: primaryColor }}
                  />
                  About &amp; Overview
                </h2>
                <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed text-justify">
                  {summary}
                </p>
              </section>
            )}

            {/* Experience */}
            {experiences && experiences.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 mb-3 pb-1 border-b border-slate-200">
                  <span
                    className="w-2 h-2 rounded-full inline-block"
                    style={{ backgroundColor: primaryColor }}
                  />
                  Experience
                </h2>
                <div className="space-y-4">
                  {experiences.map((exp) => {
                    const bullets = parseBullets(exp.description);
                    return (
                      <div
                        key={exp.id}
                        className="relative pl-4 border-l-2 border-slate-200 hover:border-sky-400 transition-colors"
                      >
                        <div
                          className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-white border-2"
                          style={{ borderColor: primaryColor }}
                        />
                        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-0.5">
                          <h3 className="font-bold text-slate-900 text-xs sm:text-[13px]">
                            {exp.position}
                          </h3>
                          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-sm">
                            {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                          </span>
                        </div>
                        <div className="text-xs font-medium text-slate-700 mb-1.5">
                          {exp.company}{exp.location ? ` • ${exp.location}` : ''}
                        </div>
                        {bullets.length > 0 ? (
                          <ul className="space-y-1 text-slate-600 list-disc list-outside ml-3 text-xs">
                            {bullets.map((b, idx) => (
                              <li key={idx} className="leading-relaxed">
                                {b}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-slate-600 leading-relaxed">{exp.description}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Projects */}
            {projects && projects.length > 0 && (
              <section>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 mb-3 pb-1 border-b border-slate-200">
                  <span
                    className="w-2 h-2 rounded-full inline-block"
                    style={{ backgroundColor: primaryColor }}
                  />
                  Featured Projects
                </h2>
                <div className="space-y-3.5">
                  {projects.map((proj) => {
                    const bullets = parseBullets(proj.description);
                    return (
                      <div
                        key={proj.id}
                        className="bg-slate-50/70 p-3.5 rounded-lg border border-slate-200/80"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="font-bold text-slate-900 text-xs sm:text-[13px]">
                            {proj.title}
                          </h4>
                          {(proj.url || proj.github) && (
                            <a
                              href={proj.url || proj.github}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-medium text-sky-600 hover:underline flex items-center gap-1"
                            >
                              <span>View</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        {proj.technologies && (
                          <div className="text-[11px] text-slate-500 font-mono mb-1.5">
                            {proj.technologies}
                          </div>
                        )}
                        {bullets.length > 0 ? (
                          <ul className="space-y-0.5 text-slate-600 list-disc list-outside ml-3 text-xs">
                            {bullets.map((b, i) => (
                              <li key={i} className="leading-relaxed">
                                {b}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {proj.description}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="md:col-span-4 space-y-6">
            {/* Skills Badges */}
            {skills && skills.length > 0 && (
              <section className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                  Skills &amp; Tech Stack
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((sk) => (
                    <span
                      key={sk.id}
                      className="px-2 py-1 rounded-md text-[11px] font-medium bg-white text-slate-700 border border-slate-200 shadow-2xs"
                    >
                      {sk.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Education */}
            {educations && educations.length > 0 && (
              <section className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
                  Education
                </h3>
                <div className="space-y-3">
                  {educations.map((edu) => (
                    <div key={edu.id} className="text-xs">
                      <div className="font-bold text-slate-900">{edu.degree}</div>
                      {edu.field && (
                        <div className="text-slate-600 text-[11px]">{edu.field}</div>
                      )}
                      <div className="text-slate-500 text-[11px]">{edu.institution}</div>
                      <div className="text-slate-400 text-[10px] mt-0.5 font-medium">
                        {edu.startDate} – {edu.endDate || 'Present'}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Languages */}
            {languages && languages.length > 0 && (
              <section className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
                  Languages
                </h3>
                <div className="space-y-2 text-xs">
                  {languages.map((lang) => (
                    <div key={lang.id || lang.name} className="flex justify-between items-center">
                      <span className="font-semibold text-slate-800">{lang.name}</span>
                      <span className="text-[11px] text-slate-500">{lang.proficiency}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications */}
            {certifications && certifications.length > 0 && (
              <section className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  Certifications
                </h3>
                <div className="space-y-2.5 text-xs">
                  {certifications.map((cert) => (
                    <div key={cert.id}>
                      <div className="font-semibold text-slate-900">{cert.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {cert.issuer} {cert.date ? `• ${cert.date}` : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
