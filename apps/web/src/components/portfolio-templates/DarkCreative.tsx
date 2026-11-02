'use client';

import React from 'react';
import { PublicPortfolioData } from '@/types/portfolio';
import { Sparkles, ExternalLink, Globe, ArrowUpRight } from 'lucide-react';

export function DarkCreative({ data }: { data: PublicPortfolioData }) {
  const { title, bio, themeConfig, projects, owner } = data;
  const fullName = `${owner?.firstName || ''} ${owner?.lastName || ''}`.trim() || title;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 selection:bg-fuchsia-500 selection:text-white">
      {/* Glow highlight */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-fuchsia-600/20 to-indigo-600/20 blur-3xl pointer-events-none rounded-full" />

      <div className="relative max-w-5xl mx-auto px-6 py-20 space-y-24">
        {/* Hero */}
        <header className="space-y-6 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-semibold text-fuchsia-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Creative Showcase</span>
          </div>

          <h1 className="text-4xl sm:text-7xl font-black tracking-tighter text-white">
            {fullName}
          </h1>

          {owner?.headline && (
            <p className="text-xl sm:text-2xl font-light text-neutral-400">
              {owner.headline}
            </p>
          )}

          <p className="text-neutral-400 text-base sm:text-lg leading-relaxed">
            {bio || owner?.bio}
          </p>

          <div className="pt-4 flex items-center justify-center gap-4 text-sm font-medium">
            {owner?.website && (
              <a
                href={owner.website}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-full bg-white text-black font-semibold hover:bg-neutral-200 transition-colors inline-flex items-center gap-2"
              >
                <span>Visit Main Site</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            )}
            {owner?.linkedin && (
              <a
                href={owner.linkedin}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-full bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors"
              >
                LinkedIn
              </a>
            )}
          </div>
        </header>

        {/* Selected Works */}
        <section className="space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Selected Works</h2>
            <p className="text-sm text-neutral-500">A curation of recent high-impact digital products and projects.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects && projects.length > 0 ? (
              projects.map((proj) => (
                <div
                  key={proj.id}
                  className="rounded-2xl border border-neutral-800/80 bg-neutral-900/50 p-8 flex flex-col justify-between hover:border-fuchsia-500/40 transition-all group backdrop-blur"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white group-hover:text-fuchsia-400 transition-colors">
                        {proj.title}
                      </h3>
                      {proj.isFeatured && (
                        <span className="text-[10px] tracking-widest uppercase font-bold px-2.5 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30">
                          Spotlight
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>

                  <div className="pt-8 space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {proj.technologies?.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-md bg-neutral-800 text-xs text-neutral-300 font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 pt-2 text-sm font-semibold">
                      {proj.projectUrl && (
                        <a
                          href={proj.projectUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-fuchsia-400 hover:text-fuchsia-300 inline-flex items-center gap-1.5"
                        >
                          <span>Live Site</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      )}
                      {proj.repoUrl && (
                        <a
                          href={proj.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-neutral-400 hover:text-white inline-flex items-center gap-1.5"
                        >
                          <span>Source</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-16 text-neutral-500 border border-dashed border-neutral-800 rounded-2xl">
                No projects published yet.
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-neutral-800/80 pt-10 pb-6 flex items-center justify-between text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} {fullName}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {owner?.github && <a href={owner.github} className="hover:text-fuchsia-400">GitHub</a>}
            {owner?.linkedin && <a href={owner.linkedin} className="hover:text-fuchsia-400">LinkedIn</a>}
          </div>
        </footer>
      </div>
    </div>
  );
}
