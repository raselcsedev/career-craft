'use client';

import React from 'react';
import { CvContent, CvStyling } from '@/types/cv';
import { Mail, Phone, MapPin, ExternalLink, User } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/ui/Icons';

interface TemplateProps {
  content: CvContent;
  styling?: CvStyling;
}

export function ExecutiveBanner({ content, styling }: TemplateProps) {
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

  const primaryColor = styling?.primaryColor || '#334155'; // default slate-700
  const fontClass =
    styling?.fontFamily === 'Merriweather'
      ? 'font-serif'
      : styling?.fontFamily === 'Fira Code'
      ? 'font-mono'
      : 'font-sans';

  // Helper to split description text into bullet points
  const parseBullets = (desc: string) => {
    if (!desc) return [];
    return desc
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => line.replace(/^[•\-\*]\s*/, ''));
  };

  // Group skills by category if available, else group into columns
  const categorizedSkills = React.useMemo(() => {
    if (!skills || skills.length === 0) return {};
    const groups: { [cat: string]: string[] } = {};
    skills.forEach((sk) => {
      const cat = sk.category?.trim() || 'Technical Skills';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(sk.name);
    });
    return groups;
  }, [skills]);

  const skillCategories = Object.keys(categorizedSkills);

  return (
    <div
      className={`w-full bg-white text-gray-900 p-8 sm:p-10 shadow-sm print:shadow-none print:p-0 min-h-[297mm] leading-normal ${fontClass}`}
    >
      {/* ── Top Header Banner with Light Tint ── */}
      <header className="bg-[#edf0f2] rounded-xs p-5 sm:p-6 mb-5 flex flex-col sm:flex-row items-center sm:items-center gap-5 border border-gray-200/60">
        {/* Avatar / Photo */}
        {personalInfo.avatarUrl ? (
          <img
            src={personalInfo.avatarUrl}
            alt={personalInfo.fullName}
            className="w-24 h-28 object-cover rounded-xs shadow-xs border-2 border-white flex-shrink-0"
          />
        ) : (
          <div className="w-24 h-28 bg-white border border-gray-300 rounded-xs flex flex-col items-center justify-center text-gray-400 flex-shrink-0 shadow-2xs">
            <User className="w-10 h-10 text-gray-400" />
            <span className="text-[10px] mt-1 text-gray-400 font-medium">Photo</span>
          </div>
        )}

        {/* Name, Headline, Contact & Links */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-black tracking-wide text-gray-900 uppercase">
            {personalInfo.fullName || 'MD. RASEL AKTAR'}
          </h1>

          {personalInfo.headline && (
            <p className="text-xs sm:text-sm font-medium text-gray-700 mt-1">
              {personalInfo.headline}
            </p>
          )}

          {/* Contact Details */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5 mt-3 text-xs text-gray-700">
            {personalInfo.email && (
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
                <span>{personalInfo.email}</span>
              </span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
                <span>{personalInfo.phone}</span>
              </span>
            )}
            {(personalInfo.city || personalInfo.country) && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
                <span>{[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}</span>
              </span>
            )}
          </div>

          {/* Social Profiles / Links */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 mt-2 text-xs font-medium text-gray-800">
            {personalInfo.linkedin && (
              <a
                href={
                  personalInfo.linkedin.startsWith('http')
                    ? personalInfo.linkedin
                    : `https://${personalInfo.linkedin}`
                }
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-blue-600 transition-colors"
              >
                <LinkedinIcon className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
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
                className="flex items-center gap-1 hover:text-gray-900 transition-colors"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>GitHub</span>
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
                className="flex items-center gap-1 hover:text-emerald-700 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Portfolio</span>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* ── Main Content Sections ── */}
      <div className="space-y-4">
        {/* Professional Summary */}
        {summary && (
          <section>
            <div className="bg-[#edf0f2] text-gray-900 font-bold text-center py-1.5 px-4 rounded-xs text-xs sm:text-[13px] tracking-wide uppercase border border-gray-200/50 mb-3">
              Professional Summary
            </div>
            <p className="text-xs sm:text-[12.5px] leading-relaxed text-gray-700 text-justify">
              {summary}
            </p>
          </section>
        )}

        {/* Professional Experience */}
        {experiences && experiences.length > 0 && (
          <section>
            <div className="bg-[#edf0f2] text-gray-900 font-bold text-center py-1.5 px-4 rounded-xs text-xs sm:text-[13px] tracking-wide uppercase border border-gray-200/50 mb-3">
              Professional Experience
            </div>
            <div className="space-y-4">
              {experiences.map((exp) => {
                const bullets = parseBullets(exp.description);
                return (
                  <div key={exp.id} className="flex flex-col sm:flex-row gap-x-6 gap-y-1">
                    {/* Left Column: Dates & Location */}
                    <div className="sm:w-36 flex-shrink-0 text-xs text-gray-700">
                      <div className="font-semibold text-gray-900">
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate || 'Present'}
                      </div>
                      {exp.location && (
                        <div className="text-gray-500 mt-0.5">{exp.location}</div>
                      )}
                    </div>

                    {/* Right Column: Company, Title & Accomplishments */}
                    <div className="flex-1 text-xs">
                      <div className="font-bold text-gray-900 text-[13px]">{exp.company}</div>
                      <div className="font-medium text-gray-700 mb-1.5">{exp.position}</div>

                      {bullets.length > 0 ? (
                        <ul className="space-y-1 text-gray-700 list-disc list-outside ml-3.5">
                          {bullets.map((bullet, idx) => (
                            <li key={idx} className="leading-relaxed">
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Education */}
        {educations && educations.length > 0 && (
          <section>
            <div className="bg-[#edf0f2] text-gray-900 font-bold text-center py-1.5 px-4 rounded-xs text-xs sm:text-[13px] tracking-wide uppercase border border-gray-200/50 mb-3">
              Education
            </div>
            <div className="space-y-3">
              {educations.map((edu) => (
                <div key={edu.id} className="flex flex-col sm:flex-row gap-x-6 gap-y-1">
                  <div className="sm:w-36 flex-shrink-0 text-xs text-gray-700">
                    <div className="font-semibold text-gray-900">
                      {edu.startDate} – {edu.endDate || 'Present'}
                    </div>
                    {edu.field && <div className="text-gray-500 mt-0.5">{edu.field}</div>}
                  </div>
                  <div className="flex-1 text-xs">
                    <div className="font-bold text-gray-900 text-[13px]">
                      {edu.degree}
                    </div>
                    <div className="text-gray-700 mt-0.5">{edu.institution}</div>
                    {edu.grade && (
                      <div className="text-gray-500 text-[11px] mt-0.5">Grade: {edu.grade}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Technical Skills (Multi-column Categorized Grid) */}
        {skills && skills.length > 0 && (
          <section>
            <div className="bg-[#edf0f2] text-gray-900 font-bold text-center py-1.5 px-4 rounded-xs text-xs sm:text-[13px] tracking-wide uppercase border border-gray-200/50 mb-3">
              Technical Skills
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-3 text-xs">
              {skillCategories.map((category) => (
                <div key={category} className="space-y-0.5">
                  <div className="font-bold text-gray-900 text-[12px]">{category}</div>
                  <div className="text-gray-700 leading-relaxed text-[11.5px]">
                    {categorizedSkills[category].join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <section>
            <div className="bg-[#edf0f2] text-gray-900 font-bold text-center py-1.5 px-4 rounded-xs text-xs sm:text-[13px] tracking-wide uppercase border border-gray-200/50 mb-3">
              Projects
            </div>
            <div className="space-y-3.5">
              {projects.map((proj) => {
                const bullets = parseBullets(proj.description);
                return (
                  <div key={proj.id} className="text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-gray-900 text-[13px]">
                      <span>{proj.title}</span>
                      {(proj.url || proj.github) && (
                        <a
                          href={proj.url || proj.github}
                          target="_blank"
                          rel="noreferrer"
                          className="text-gray-500 hover:text-gray-900 transition-colors inline-flex items-center"
                          title="View project link"
                        >
                          <ExternalLink className="w-3 h-3 ml-0.5" />
                        </a>
                      )}
                    </div>
                    {proj.technologies && (
                      <div className="text-gray-600 text-[11px] mb-1">
                        {proj.technologies}
                      </div>
                    )}
                    {bullets.length > 0 ? (
                      <ul className="space-y-1 text-gray-700 list-disc list-outside ml-3.5 mt-1">
                        {bullets.map((b, i) => (
                          <li key={i} className="leading-relaxed">
                            {b}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-700 leading-relaxed">{proj.description}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Languages */}
        {languages && languages.length > 0 && (
          <section>
            <div className="bg-[#edf0f2] text-gray-900 font-bold text-center py-1.5 px-4 rounded-xs text-xs sm:text-[13px] tracking-wide uppercase border border-gray-200/50 mb-3">
              Languages
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              {languages.map((lang) => (
                <div key={lang.id || lang.name}>
                  <div className="font-bold text-gray-900">{lang.name}</div>
                  <div className="text-gray-600 text-[11.5px]">{lang.proficiency}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications (if present) */}
        {certifications && certifications.length > 0 && (
          <section>
            <div className="bg-[#edf0f2] text-gray-900 font-bold text-center py-1.5 px-4 rounded-xs text-xs sm:text-[13px] tracking-wide uppercase border border-gray-200/50 mb-3">
              Certifications
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {certifications.map((cert) => (
                <div key={cert.id} className="border-l-2 border-gray-300 pl-2.5">
                  <div className="font-bold text-gray-900">{cert.name}</div>
                  <div className="text-gray-600 text-[11px]">
                    {cert.issuer} {cert.date ? `• ${cert.date}` : ''}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
