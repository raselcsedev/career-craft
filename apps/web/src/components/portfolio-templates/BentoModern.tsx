'use client';

import React from 'react';
import { PublicPortfolioData } from '@/types/portfolio';
import {
  Code2,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Sparkles,
  ArrowUpRight,
  Star,
  Layers,
  GraduationCap,
  Briefcase,
  Laptop,
  CheckCircle,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/ui/Icons';

export function BentoModern({ data }: { data: PublicPortfolioData }) {
  const { title, bio, themeConfig, projects = [], owner } = data;
  const primaryColor = themeConfig?.primaryColor || '#6366f1'; // indigo

  const fullName =
    `${owner?.firstName || ''} ${owner?.lastName || ''}`.trim() || title || 'Developer';
  const headline =
    owner?.headline || 'Frontend Developer & UI/UX Specialist';
  const displayBio =
    bio ||
    owner?.bio ||
    'Crafting high-performance, accessible, and elegant web interfaces with Next.js, React, and TypeScript.';

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans antialiased selection:bg-indigo-500 selection:text-white p-4 sm:p-8 md:p-12">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* ── Top Header ── */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-indigo-500/20">
              {fullName.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-white text-base leading-tight">{fullName}</div>
              <div className="text-xs text-neutral-400">{headline}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[11px] font-medium text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Available for projects</span>
            </div>
            {owner?.github && (
              <a
                href={owner.github.startsWith('http') ? owner.github : `https://${owner.github}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white transition-colors"
                title="GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
            )}
            {owner?.linkedin && (
              <a
                href={
                  owner.linkedin.startsWith('http') ? owner.linkedin : `https://${owner.linkedin}`
                }
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white transition-colors"
                title="LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            )}
          </div>
        </header>

        {/* ── Bento Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Bento Box 1: Large Hero / Bio (7 cols) */}
          <div className="md:col-span-7 rounded-3xl bg-neutral-900/60 border border-neutral-800 p-8 flex flex-col justify-between space-y-6 relative overflow-hidden backdrop-blur-xs">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Modern Portfolio</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Building scalable web apps with precision &amp; speed.
              </h1>
              <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
                {displayBio}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-neutral-800/80">
              {(owner?.city || owner?.country) && (
                <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{[owner?.city, owner?.country].filter(Boolean).join(', ')}</span>
                </div>
              )}
              {owner?.phone && (
                <div className="text-xs text-neutral-400">
                  <span>{owner.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Bento Box 2: Quick Metrics & Highlights (5 cols) */}
          <div className="md:col-span-5 grid grid-cols-2 gap-4">
            <div className="rounded-3xl bg-neutral-900/60 border border-neutral-800 p-6 flex flex-col justify-between">
              <span className="text-xs font-mono text-neutral-500 uppercase">Experience</span>
              <div className="text-3xl font-extrabold text-white mt-2">4+ Years</div>
              <p className="text-[11px] text-neutral-400 mt-1">Enterprise &amp; E-commerce</p>
            </div>
            <div className="rounded-3xl bg-neutral-900/60 border border-neutral-800 p-6 flex flex-col justify-between">
              <span className="text-xs font-mono text-neutral-500 uppercase">Projects</span>
              <div className="text-3xl font-extrabold text-indigo-400 mt-2">15+</div>
              <p className="text-[11px] text-neutral-400 mt-1">Delivered to Production</p>
            </div>
            <div className="rounded-3xl bg-neutral-900/60 border border-neutral-800 p-6 flex flex-col justify-between">
              <span className="text-xs font-mono text-neutral-500 uppercase">Stack</span>
              <div className="text-2xl font-extrabold text-emerald-400 mt-2">Next.js 15</div>
              <p className="text-[11px] text-neutral-400 mt-1">Angular 17+ &amp; React</p>
            </div>
            <div className="rounded-3xl bg-neutral-900/60 border border-neutral-800 p-6 flex flex-col justify-between">
              <span className="text-xs font-mono text-neutral-500 uppercase">Quality</span>
              <div className="text-2xl font-extrabold text-cyan-400 mt-2">100%</div>
              <p className="text-[11px] text-neutral-400 mt-1">Clean &amp; Accessible</p>
            </div>
          </div>

          {/* Bento Box 3: Skills Matrix (12 cols) */}
          <div className="md:col-span-12 rounded-3xl bg-neutral-900/40 border border-neutral-800 p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <span>Technical Capabilities</span>
              </h2>
              <span className="text-xs text-neutral-500">Frontend • Backend • Tools</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                'JavaScript (ES6+)',
                'TypeScript',
                'React.js',
                'Next.js 14/15',
                'Angular 17+',
                'RxJS',
                'Tailwind CSS',
                'Shadcn UI',
                'TanStack Query',
                'Redux Toolkit',
                'Node.js',
                'Express.js',
                'NestJS',
                'MySQL',
                'MongoDB',
                'Prisma ORM',
                'REST API',
                'GraphQL',
                'Git & GitHub',
                'Docker',
                'Vercel',
                'Render',
              ].map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium bg-neutral-800/80 text-neutral-300 border border-neutral-700/60 hover:border-indigo-500/50 hover:text-white transition-colors"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Bento Box 4: Featured Projects Showcase (12 cols) */}
          <div className="md:col-span-12 space-y-4">
            <div className="flex items-center justify-between pt-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Laptop className="w-5 h-5 text-indigo-400" />
                <span>Featured Project Showcase</span>
              </h2>
              <span className="text-xs text-neutral-400">Total: {projects.length} Projects</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects && projects.length > 0 ? (
                projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="rounded-3xl bg-neutral-900/60 border border-neutral-800 p-6 flex flex-col justify-between hover:border-indigo-500/50 transition-all hover:shadow-xl group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-white text-base group-hover:text-indigo-400 transition-colors">
                          {proj.title}
                        </h3>
                        {proj.isFeatured && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                            <Star className="w-2.5 h-2.5 fill-indigo-300" />
                            <span>Featured</span>
                          </span>
                        )}
                      </div>

                      <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed line-clamp-3">
                        {proj.description}
                      </p>

                      {proj.technologies && proj.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {proj.technologies.slice(0, 5).map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-neutral-800 text-neutral-300 border border-neutral-700/50"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-5 mt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                      {proj.repoUrl ? (
                        <a
                          href={proj.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
                        >
                          <GithubIcon className="w-3.5 h-3.5" />
                          <span>Code</span>
                        </a>
                      ) : (
                        <span />
                      )}

                      {proj.projectUrl && (
                        <a
                          href={proj.projectUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                          <span>Live Preview</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-10 border border-dashed border-neutral-800 rounded-3xl text-neutral-500 text-sm">
                  No projects available yet.
                </div>
              )}
            </div>
          </div>

          {/* Bento Box 5: Contact Footer Banner (12 cols) */}
          <div className="md:col-span-12 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-neutral-900 to-neutral-900 border border-neutral-800 p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">Let&apos;s build together</h3>
              <p className="text-xs sm:text-sm text-neutral-400">
                Open for frontend &amp; full-stack roles, architecture consulting, and product builds.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {owner?.linkedin && (
                <a
                  href={
                    owner.linkedin.startsWith('http') ? owner.linkedin : `https://${owner.linkedin}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md shadow-indigo-600/20 transition-all hover:scale-105"
                >
                  Connect on LinkedIn
                </a>
              )}
              {owner?.github && (
                <a
                  href={owner.github.startsWith('http') ? owner.github : `https://${owner.github}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs transition-all"
                >
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="pt-8 text-center text-xs text-neutral-600">
          © {new Date().getFullYear()} {fullName}. Built with CareerCraft.
        </footer>
      </div>
    </div>
  );
}
