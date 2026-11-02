'use client';

import React from 'react';
import { PublicPortfolioData } from '@/types/portfolio';
import { Terminal, ExternalLink, Globe, Mail, MapPin, Code2, GitBranch } from 'lucide-react';

export function MinimalDeveloper({ data }: { data: PublicPortfolioData }) {
  const { title, bio, themeConfig, projects, owner } = data;
  const primaryColor = themeConfig?.primaryColor || '#10b981'; // emerald default for dev

  const fullName = `${owner?.firstName || ''} ${owner?.lastName || ''}`.trim() || title;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-mono antialiased selection:bg-emerald-500 selection:text-black">
      {/* Top terminal bar */}
      <div className="border-b border-gray-800 bg-gray-900/60 sticky top-0 backdrop-blur z-20 px-6 py-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="text-gray-400 ml-2">~/{data.slug}.dev</span>
        </div>
        <div className="text-gray-500">status: <span className="text-emerald-400">deployed</span></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-20">
        {/* Hero Section */}
        <header className="space-y-4 border-b border-gray-800/80 pb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-gray-900 border border-gray-800 text-xs text-emerald-400">
            <Terminal className="w-3.5 h-3.5" />
            <span>Developer Portfolio</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            {fullName}
          </h1>

          {owner?.headline && (
            <p className="text-lg text-emerald-400 font-medium">
              &gt; {owner.headline}
            </p>
          )}

          <p className="text-gray-400 max-w-2xl text-sm sm:text-base leading-relaxed font-sans">
            {bio || owner?.bio}
          </p>

          {/* Social / Contact links */}
          <div className="flex flex-wrap gap-4 pt-4 text-xs font-mono">
            {owner?.github && (
              <a
                href={owner.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors"
              >
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span>github</span>
              </a>
            )}
            {owner?.website && (
              <a
                href={owner.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors"
              >
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>website</span>
              </a>
            )}
            {owner?.city && (
              <span className="flex items-center gap-1.5 text-gray-500">
                <MapPin className="w-4 h-4" />
                <span>{owner.city}{owner.country ? `, ${owner.country}` : ''}</span>
              </span>
            )}
          </div>
        </header>

        {/* Projects Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
            <span className="text-emerald-400 font-bold text-lg">01.</span>
            <h2 className="text-xl font-bold text-white tracking-tight">Featured Projects</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects && projects.length > 0 ? (
              projects.map((proj) => (
                <div
                  key={proj.id}
                  className="rounded-lg border border-gray-800 bg-gray-900/40 p-6 flex flex-col justify-between hover:border-emerald-500/50 transition-colors group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors">
                        {proj.title}
                      </h3>
                      {proj.isFeatured && (
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed font-sans">
                      {proj.description}
                    </p>
                  </div>

                  <div className="pt-6 space-y-4">
                    {/* Tech tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {proj.technologies?.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-gray-800 text-[11px] text-gray-300 font-mono"
                        >
                          #{tech}
                        </span>
                      ))}
                    </div>

                    {/* Action links */}
                    <div className="flex items-center gap-3 pt-2 text-xs">
                      {proj.projectUrl && (
                        <a
                          href={proj.projectUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-emerald-400 hover:underline"
                        >
                          <span>Live Demo</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {proj.repoUrl && (
                        <a
                          href={proj.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-gray-400 hover:text-white"
                        >
                          <span>Repository</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-12 text-sm text-gray-500 border border-dashed border-gray-800 rounded-lg">
                No public projects added to this portfolio yet.
              </div>
            )}
          </div>
        </section>

        {/* Contact Footer */}
        <footer className="border-t border-gray-800 pt-12 pb-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4 font-mono">
          <p>© {new Date().getFullYear()} {fullName}. Built on CareerCraft.</p>
          <div className="flex items-center gap-4">
            {owner?.github && <a href={owner.github} className="hover:text-emerald-400">GitHub</a>}
            {owner?.linkedin && <a href={owner.linkedin} className="hover:text-emerald-400">LinkedIn</a>}
            {owner?.website && <a href={owner.website} className="hover:text-emerald-400">Website</a>}
          </div>
        </footer>
      </div>
    </div>
  );
}
