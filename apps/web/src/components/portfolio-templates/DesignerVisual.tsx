'use client';

import React from 'react';
import { PublicPortfolioData } from '@/types/portfolio';
import { Palette, ExternalLink, ArrowUpRight } from 'lucide-react';

export function DesignerVisual({ data }: { data: PublicPortfolioData }) {
  const { title, bio, themeConfig, projects, owner } = data;
  const fullName = `${owner?.firstName || ''} ${owner?.lastName || ''}`.trim() || title;

  return (
    <div className="min-h-screen bg-amber-50/30 text-stone-900 font-sans selection:bg-stone-900 selection:text-amber-50">
      <div className="max-w-6xl mx-auto px-6 py-16 space-y-20">
        {/* Header */}
        <header className="space-y-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900 text-amber-50 text-xs font-semibold">
            <Palette className="w-3.5 h-3.5" />
            <span>Visual &amp; Product Design</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-stone-950">
            {fullName}
          </h1>

          {owner?.headline && (
            <p className="text-xl sm:text-2xl text-stone-700 font-serif italic">
              {owner.headline}
            </p>
          )}

          <p className="text-stone-600 text-base sm:text-lg leading-relaxed">
            {bio || owner?.bio}
          </p>

          <div className="flex items-center gap-4 pt-2 text-xs font-bold uppercase tracking-wider">
            {owner?.website && (
              <a href={owner.website} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-stone-600">
                Portfolio Site
              </a>
            )}
            {owner?.linkedin && (
              <a href={owner.linkedin} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-stone-600">
                LinkedIn
              </a>
            )}
          </div>
        </header>

        {/* Visual Gallery Grid */}
        <section className="space-y-8">
          <div className="border-b border-stone-300 pb-3 flex items-center justify-between">
            <h2 className="text-xl font-bold text-stone-950 uppercase tracking-wider text-xs">Work Gallery</h2>
            <span className="text-xs text-stone-500 font-mono">{projects?.length || 0} Case Studies</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects && projects.length > 0 ? (
              projects.map((proj) => (
                <div
                  key={proj.id}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  {/* Top card banner */}
                  <div className="h-36 bg-gradient-to-br from-stone-100 via-amber-100/40 to-stone-200 p-4 flex items-start justify-between">
                    <span className="text-xs font-mono text-stone-500 uppercase tracking-wider">Case Study</span>
                    {proj.projectUrl && (
                      <a
                        href={proj.projectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-stone-800 shadow-sm hover:scale-105 transition-transform"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg text-stone-900">{proj.title}</h3>
                      <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                        {proj.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-stone-100 flex flex-wrap gap-1.5">
                      {proj.technologies?.map((tech, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-stone-100 text-[11px] font-medium text-stone-700">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-16 text-stone-400 bg-white rounded-2xl border border-dashed border-stone-200">
                No visual case studies published yet.
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-stone-200 pt-8 flex items-center justify-between text-xs text-stone-500">
          <p>© {new Date().getFullYear()} {fullName}</p>
          <p className="font-mono">Visual Experience</p>
        </footer>
      </div>
    </div>
  );
}
