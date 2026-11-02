'use client';

import React from 'react';
import { CvContent, CvStyling } from '@/types/cv';
import { Mail, Phone, MapPin, Globe, Sparkles, FolderGit2, Star } from 'lucide-react';

interface TemplateProps {
  content: CvContent;
  styling?: CvStyling;
}

export function CreativeAccent({ content, styling }: TemplateProps) {
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

  const primaryColor = styling?.primaryColor || '#ec4899'; // pink-500 / creative accent
  const fontClass =
    styling?.fontFamily === 'Merriweather'
      ? 'font-serif'
      : styling?.fontFamily === 'Fira Code'
      ? 'font-mono'
      : 'font-sans';

  return (
    <div
      className={`w-full bg-white text-gray-800 shadow-sm print:shadow-none min-h-[297mm] ${fontClass}`}
    >
      {/* Top Graphic Banner */}
      <div
        className="p-8 sm:p-10 text-white relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, #4f46e5 100%)`,
        }}
      >
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-44 h-44 rounded-full bg-white/10 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold mb-3 tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              Creative Portfolio Resume
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {personalInfo.fullName || 'Your Full Name'}
            </h1>
            <p className="text-lg font-medium text-white/90 mt-1">
              {personalInfo.headline || 'Creative Specialist & Innovator'}
            </p>
          </div>

          <div className="flex flex-col gap-2 text-xs text-white/90 bg-black/15 p-4 rounded-xl backdrop-blur-xs">
            {personalInfo.email && (
              <span className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-white/70" />
                {personalInfo.email}
              </span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-white/70" />
                {personalInfo.phone}
              </span>
            )}
            {(personalInfo.city || personalInfo.country) && (
              <span className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-white/70" />
                {[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}
              </span>
            )}
            {personalInfo.website && (
              <span className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-white/70" />
                {personalInfo.website.replace(/^https?:\/\//, '')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-8 sm:p-10 space-y-8">
        {/* Summary with quote highlight */}
        {summary && (
          <section className="bg-gradient-to-r from-gray-50 to-white p-5 rounded-2xl border-l-4" style={{ borderColor: primaryColor }}>
            <p className="text-sm text-gray-700 leading-relaxed font-medium italic">
              &ldquo;{summary}&rdquo;
            </p>
          </section>
        )}

        {/* Experience Cards */}
        {experiences && experiences.length > 0 && (
          <section>
            <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: primaryColor }} />
              Professional Journey
            </h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-all bg-white shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <span className="font-bold text-gray-900 text-sm">{exp.position}</span>
                    <span
                      className="text-xs px-2.5 py-0.5 rounded-full font-semibold w-fit"
                      style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                    >
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate || 'Present'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 font-medium mb-2">
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

        {/* 2-Column Section for Skills & Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Projects */}
          {projects && projects.length > 0 && (
            <section>
              <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FolderGit2 className="w-4 h-4" style={{ color: primaryColor }} />
                Creative Work & Projects
              </h2>
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id} className="p-3.5 rounded-xl bg-gray-50/80 border border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-900">{proj.title}</span>
                      {proj.url && (
                        <a
                          href={proj.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-semibold hover:underline"
                          style={{ color: primaryColor }}
                        >
                          View →
                        </a>
                      )}
                    </div>
                    {proj.technologies && (
                      <span className="text-[11px] font-semibold text-gray-500 block mt-0.5">
                        {proj.technologies}
                      </span>
                    )}
                    {proj.description && (
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        {proj.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills & Education */}
          <div className="space-y-6">
            {skills && skills.length > 0 && (
              <section>
                <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="w-4 h-4" style={{ color: primaryColor }} />
                  Creative & Technical Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="px-3 py-1 rounded-lg text-xs font-semibold border shadow-xs"
                      style={{
                        borderColor: `${primaryColor}30`,
                        color: primaryColor,
                        backgroundColor: `${primaryColor}08`,
                      }}
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {educations && educations.length > 0 && (
              <section>
                <h2 className="text-base font-bold text-gray-900 mb-3">Education</h2>
                <div className="space-y-2.5">
                  {educations.map((edu) => (
                    <div key={edu.id} className="text-xs border-l-2 pl-3 border-gray-200">
                      <div className="font-bold text-gray-900">
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </div>
                      <div className="text-gray-600">{edu.institution}</div>
                      <div className="text-gray-400 text-[11px]">
                        {edu.startDate} – {edu.endDate || 'Present'}
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
