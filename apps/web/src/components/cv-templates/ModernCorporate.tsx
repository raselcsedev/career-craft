'use client';

import React from 'react';
import { CvContent, CvStyling } from '@/types/cv';
import { Mail, Phone, MapPin, Globe, Briefcase, GraduationCap, Code2, Award, Languages } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/ui/Icons';

interface TemplateProps {
  content: CvContent;
  styling?: CvStyling;
}

export function ModernCorporate({ content, styling }: TemplateProps) {
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

  const primaryColor = styling?.primaryColor || '#0f766e'; // teal-700
  const fontClass =
    styling?.fontFamily === 'Merriweather'
      ? 'font-serif'
      : styling?.fontFamily === 'Fira Code'
      ? 'font-mono'
      : 'font-sans';

  return (
    <div
      className={`w-full bg-white text-gray-800 shadow-sm print:shadow-none grid grid-cols-1 md:grid-cols-12 min-h-[297mm] ${fontClass}`}
    >
      {/* Sidebar Column (4 of 12) */}
      <aside
        className="md:col-span-4 p-6 sm:p-8 text-white space-y-6"
        style={{ backgroundColor: primaryColor }}
      >
        {/* Profile Avatar / Initials */}
        <div className="text-center sm:text-left">
          <div className="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-3xl font-bold tracking-wider mx-auto sm:mx-0 shadow-inner">
            {personalInfo.fullName
              ? personalInfo.fullName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()
              : 'CC'}
          </div>
          <h1 className="text-2xl font-bold mt-4 tracking-tight leading-snug">
            {personalInfo.fullName || 'Your Full Name'}
          </h1>
          <p className="text-xs uppercase tracking-widest text-white/80 font-semibold mt-1">
            {personalInfo.headline || 'Professional Headline'}
          </p>
        </div>

        {/* Contact Info */}
        <div className="space-y-3 pt-2 text-xs border-t border-white/20">
          <h3 className="font-bold uppercase tracking-wider text-white/90 text-[11px]">Contact</h3>
          {personalInfo.email && (
            <div className="flex items-center gap-2.5 break-all">
              <Mail className="w-3.5 h-3.5 shrink-0 text-white/70" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-2.5">
              <Phone className="w-3.5 h-3.5 shrink-0 text-white/70" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {(personalInfo.city || personalInfo.country) && (
            <div className="flex items-center gap-2.5">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-white/70" />
              <span>{[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-2.5 break-all">
              <Globe className="w-3.5 h-3.5 shrink-0 text-white/70" />
              <span>{personalInfo.website.replace(/^https?:\/\//, '')}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-2.5 break-all">
              <LinkedinIcon className="w-3.5 h-3.5 shrink-0 text-white/70" />
              <span>{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>
            </div>
          )}
          {personalInfo.github && (
            <div className="flex items-center gap-2.5 break-all">
              <GithubIcon className="w-3.5 h-3.5 shrink-0 text-white/70" />
              <span>{personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</span>
            </div>
          )}
        </div>

        {/* Education in sidebar */}
        {educations && educations.length > 0 && (
          <div className="space-y-3 pt-2 border-t border-white/20">
            <h3 className="font-bold uppercase tracking-wider text-white/90 text-[11px] flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5" />
              Education
            </h3>
            <div className="space-y-2.5">
              {educations.map((edu) => (
                <div key={edu.id} className="text-xs">
                  <div className="font-semibold text-white">
                    {edu.degree} {edu.field ? `in ${edu.field}` : ''}
                  </div>
                  <div className="text-white/80">{edu.institution}</div>
                  <div className="text-[11px] text-white/60">
                    {edu.startDate} – {edu.endDate || 'Present'}
                    {edu.grade && ` • GPA: ${edu.grade}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills in sidebar */}
        {skills && skills.length > 0 && (
          <div className="space-y-3 pt-2 border-t border-white/20">
            <h3 className="font-bold uppercase tracking-wider text-white/90 text-[11px] flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" />
              Skills & Tools
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className="px-2 py-0.5 bg-white/15 backdrop-blur-xs rounded text-[11px] font-medium border border-white/10"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages in sidebar */}
        {languages && languages.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-white/20 text-xs">
            <h3 className="font-bold uppercase tracking-wider text-white/90 text-[11px] flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5" />
              Languages
            </h3>
            {languages.map((l) => (
              <div key={l.id} className="flex justify-between text-white/90 text-[11px]">
                <span className="font-medium">{l.name}</span>
                <span className="text-white/70">{l.proficiency}</span>
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* Main Column (8 of 12) */}
      <main className="md:col-span-8 p-6 sm:p-10 space-y-7 bg-white">
        {/* Executive Summary */}
        {summary && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-wider pb-1.5 mb-2.5 border-b-2"
              style={{ color: primaryColor, borderColor: `${primaryColor}30` }}
            >
              Professional Profile
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{summary}</p>
          </section>
        )}

        {/* Work Experience */}
        {experiences && experiences.length > 0 && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-wider pb-1.5 mb-4 border-b-2 flex items-center gap-1.5"
              style={{ color: primaryColor, borderColor: `${primaryColor}30` }}
            >
              <Briefcase className="w-4 h-4" />
              Experience
            </h2>
            <div className="space-y-5">
              {experiences.map((exp) => (
                <div key={exp.id} className="relative pl-4 border-l-2 border-gray-200">
                  <div
                    className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full"
                    style={{ backgroundColor: primaryColor }}
                  />
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-0.5">
                    <h3 className="text-sm font-bold text-gray-900">{exp.position}</h3>
                    <span className="text-xs font-medium text-gray-500">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate || 'Present'}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-gray-600 mb-2">
                    {exp.company} {exp.location && `• ${exp.location}`}
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

        {/* Key Projects */}
        {projects && projects.length > 0 && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-wider pb-1.5 mb-3 border-b-2"
              style={{ color: primaryColor, borderColor: `${primaryColor}30` }}
            >
              Featured Projects
            </h2>
            <div className="space-y-3.5">
              {projects.map((proj) => (
                <div key={proj.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-900">{proj.title}</span>
                    {proj.url && (
                      <a
                        href={proj.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-medium hover:underline"
                        style={{ color: primaryColor }}
                      >
                        Visit Project →
                      </a>
                    )}
                  </div>
                  {proj.technologies && (
                    <p className="text-[11px] font-semibold text-gray-500 mt-0.5">
                      {proj.technologies}
                    </p>
                  )}
                  {proj.description && (
                    <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                      {proj.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <section>
            <h2
              className="text-xs font-bold uppercase tracking-wider pb-1.5 mb-2.5 border-b-2 flex items-center gap-1.5"
              style={{ color: primaryColor, borderColor: `${primaryColor}30` }}
            >
              <Award className="w-4 h-4" />
              Honors & Certifications
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {certifications.map((c) => (
                <div key={c.id} className="p-2 bg-gray-50 rounded border border-gray-100">
                  <div className="font-semibold text-gray-900">{c.name}</div>
                  <div className="text-gray-500 text-[11px]">{c.issuer} {c.date && `• ${c.date}`}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
