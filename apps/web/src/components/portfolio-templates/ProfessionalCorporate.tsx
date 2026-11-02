'use client';

import React from 'react';
import { PublicPortfolioData } from '@/types/portfolio';
import { Briefcase, Mail, MapPin, Globe, ExternalLink, ArrowRight } from 'lucide-react';

export function ProfessionalCorporate({ data }: { data: PublicPortfolioData }) {
  const { title, bio, themeConfig, projects, owner } = data;
  const fullName = `${owner?.firstName || ''} ${owner?.lastName || ''}`.trim() || title;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-bold text-slate-900 tracking-tight text-lg">{fullName}</span>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
            {owner?.city && (
              <span className="hidden sm:inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {owner.city}
              </span>
            )}
            {owner?.linkedin && (
              <a
                href={owner.linkedin}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded bg-slate-900 text-white hover:bg-slate-800 transition-colors"
              >
                Connect on LinkedIn
              </a>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-16">
        {/* Executive Bio Hero */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-50 text-blue-800 text-xs font-semibold">
            <Briefcase className="w-3.5 h-3.5 text-blue-600" />
            <span>Executive Portfolio</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900">
            {fullName}
          </h1>

          {owner?.headline && (
            <p className="text-lg sm:text-xl font-medium text-blue-900 leading-snug">
              {owner.headline}
            </p>
          )}

          <p className="text-slate-600 text-base leading-relaxed max-w-3xl">
            {bio || owner?.bio}
          </p>

          <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-100 text-xs font-medium text-slate-600">
            {owner?.website && (
              <a href={owner.website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-blue-600">
                <Globe className="w-4 h-4 text-slate-400" />
                <span>{owner.website.replace(/^https?:\/\//, '')}</span>
              </a>
            )}
            {owner?.city && (
              <span className="flex items-center gap-1.5 text-slate-500">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{owner.city}{owner.country ? `, ${owner.country}` : ''}</span>
              </span>
            )}
          </div>
        </div>

        {/* Case Studies / Key Deliverables */}
        <section className="space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Key Projects &amp; Initiatives</h2>
            <p className="text-xs text-slate-500 mt-1">Demonstrated business impact, architecture, and technology leadership.</p>
          </div>

          <div className="space-y-4">
            {projects && projects.length > 0 ? (
              projects.map((proj) => (
                <div
                  key={proj.id}
                  className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 hover:border-blue-300 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-6"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-slate-900 text-lg">{proj.title}</h3>
                      {proj.isFeatured && (
                        <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          Priority Project
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{proj.description}</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {proj.technologies?.map((tech, idx) => (
                        <span key={idx} className="px-2.5 py-0.5 rounded bg-slate-100 text-xs font-medium text-slate-700">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex sm:flex-col gap-2 shrink-0">
                    {proj.projectUrl && (
                      <a
                        href={proj.projectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5"
                      >
                        <span>View Project</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {proj.repoUrl && (
                      <a
                        href={proj.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5"
                      >
                        <span>Repository</span>
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-sm text-slate-500 bg-white rounded-xl border border-dashed border-slate-200">
                No initiatives published yet.
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 pt-8 pb-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {fullName}. All rights reserved.</p>
          <p>Published with CareerCraft</p>
        </footer>
      </div>
    </div>
  );
}
