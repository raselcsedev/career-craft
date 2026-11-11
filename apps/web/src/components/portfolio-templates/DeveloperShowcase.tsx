'use client';

import React, { useState } from 'react';
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
  CheckCircle2,
  Layers,
  Briefcase,
  GraduationCap,
  ChevronRight,
  Terminal,
  Send,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '@/components/ui/Icons';

export function DeveloperShowcase({ data }: { data: PublicPortfolioData }) {
  const { title, bio, themeConfig, projects = [], owner } = data;
  const primaryColor = themeConfig?.primaryColor || '#06b6d4'; // cyan default

  const fullName =
    `${owner?.firstName || ''} ${owner?.lastName || ''}`.trim() || title || 'Md. Rasel Aktar';
  const headline =
    owner?.headline || 'Frontend Developer | React.js | Next.js | Angular | TypeScript';
  const displayBio =
    bio ||
    owner?.bio ||
    'Passionate Frontend & Full-Stack Developer with 4+ years of experience building high-performance web applications, enterprise ERPs, and modern SaaS products.';

  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Skill groupings
  const skillCategories = [
    {
      category: 'Languages',
      skills: ['JavaScript (ES6+)', 'TypeScript', 'HTML5', 'CSS3', 'Sass', 'SQL'],
    },
    {
      category: 'Frameworks & Libraries',
      skills: [
        'React.js',
        'Next.js 14/15',
        'Angular 17+',
        'RxJS',
        'TanStack Query',
        'Redux Toolkit',
        'next-intl',
      ],
    },
    {
      category: 'Styling & UI',
      skills: [
        'Tailwind CSS',
        'Shadcn UI',
        'Aceternity UI',
        'Bootstrap',
        'Responsive Design',
      ],
    },
    {
      category: 'Backend & Data',
      skills: [
        'Node.js',
        'Express.js',
        'NestJS',
        'Prisma ORM',
        'MySQL',
        'MongoDB',
        'REST & GraphQL',
      ],
    },
    {
      category: 'Tools & DevOps',
      skills: ['Git', 'GitHub', 'Vercel', 'Render', 'Postman', 'Chrome DevTools', 'Docker'],
    },
  ];

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 font-sans antialiased selection:bg-cyan-500 selection:text-black relative overflow-x-hidden">
      {/* ── Ambient Background Glows ── */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-10 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* ── Top Floating Glass Navbar ── */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#070b12]/80 border-b border-slate-800/80 px-6 py-3.5 transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Brand / Logo */}
          <a href="#hero" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              {fullName.charAt(0)}
            </div>
            <div className="text-sm font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
              {fullName}
            </div>
          </a>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
            <a href="#projects" className="hover:text-cyan-400 transition-colors">
              Projects
            </a>
            <a href="#skills" className="hover:text-cyan-400 transition-colors">
              Skills
            </a>
            <a href="#about" className="hover:text-cyan-400 transition-colors">
              About
            </a>
            <a href="#contact" className="hover:text-cyan-400 transition-colors">
              Contact
            </a>
          </nav>

          {/* Status Badge & CTA */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[11px] font-medium text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Available for Hire</span>
            </div>
            <a
              href="#contact"
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-xs font-semibold text-white shadow-md shadow-cyan-500/20 transition-all hover:scale-[1.02]"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </header>

      {/* ── Main Container ── */}
      <main className="max-w-6xl mx-auto px-6 py-12 md:py-20 space-y-24">
        {/* ── Hero Section ── */}
        <section id="hero" className="space-y-6 pt-4">
          {/* Status Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs text-slate-300 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Frontend &amp; Full-Stack Web Developer</span>
          </div>

          {/* Headline */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
              Hi 👋, I&apos;m{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                {fullName}
              </span>
            </h1>
            <p className="text-xl sm:text-2xl font-semibold text-slate-300 max-w-3xl leading-snug">
              {headline}
            </p>
          </div>

          {/* Bio paragraph */}
          <p className="text-slate-400 max-w-2xl text-base sm:text-lg leading-relaxed">
            {displayBio}
          </p>

          {/* Action Buttons & Socials */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02]"
            >
              <span>Explore Projects</span>
              <ChevronRight className="w-4 h-4" />
            </a>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 text-sm font-semibold transition-all hover:border-slate-500"
            >
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>Contact Me</span>
            </a>

            {/* Social Icons Dock */}
            <div className="flex items-center gap-2.5 ml-0 sm:ml-2">
              {owner?.github && (
                <a
                  href={owner.github.startsWith('http') ? owner.github : `https://${owner.github}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 hover:text-cyan-400 text-slate-400 transition-all hover:scale-105"
                  title="GitHub Profile"
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
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 hover:text-cyan-400 text-slate-400 transition-all hover:scale-105"
                  title="LinkedIn Profile"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>
              )}
              {owner?.website && (
                <a
                  href={
                    owner.website.startsWith('http') ? owner.website : `https://${owner.website}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 hover:text-cyan-400 text-slate-400 transition-all hover:scale-105"
                  title="Personal Website"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* ── Key Metrics Cards ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-slate-800/80">
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400">4+</div>
              <div className="text-xs text-slate-400 mt-1">Years Experience</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400">15+</div>
              <div className="text-xs text-slate-400 mt-1">Production Apps</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">10+</div>
              <div className="text-xs text-slate-400 mt-1">Storefront Themes</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-sky-400">100%</div>
              <div className="text-xs text-slate-400 mt-1">Responsive Code</div>
            </div>
          </div>
        </section>

        {/* ── Featured Projects Section ── */}
        <section id="projects" className="space-y-8 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
                <Terminal className="w-3.5 h-3.5" />
                <span>Portfolio Showcase</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Featured Projects
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md">
              Full-stack SaaS platforms, enterprise systems, and high-performance web applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects && projects.length > 0 ? (
              projects.map((proj) => (
                <div
                  key={proj.id}
                  className="group rounded-2xl bg-gradient-to-b from-slate-900/90 to-[#0b101c]/90 border border-slate-800 p-6 flex flex-col justify-between hover:border-cyan-500/50 transition-all hover:shadow-xl hover:shadow-cyan-500/5"
                >
                  <div className="space-y-4">
                    {/* Header + Badges */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                          {proj.title}
                        </h3>
                        {proj.isFeatured && (
                          <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                            <Star className="w-2.5 h-2.5 fill-amber-300" />
                            <span>Featured</span>
                          </span>
                        )}
                      </div>

                      {/* Project Links */}
                      <div className="flex items-center gap-2">
                        {proj.repoUrl && (
                          <a
                            href={proj.repoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="GitHub Repository"
                          >
                            <GithubIcon className="w-4 h-4" />
                          </a>
                        )}
                        {proj.projectUrl && (
                          <a
                            href={proj.projectUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500 text-cyan-400 hover:text-black border border-cyan-500/30 transition-all"
                            title="Live Demo"
                          >
                            <ArrowUpRight className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-slate-300 text-sm leading-relaxed line-clamp-4">
                      {proj.description}
                    </p>

                    {/* Technologies Chips */}
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {proj.technologies.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-slate-800/70 text-cyan-300/90 border border-slate-700/60"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="pt-6 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-mono">Production Ready</span>
                    {proj.projectUrl && (
                      <a
                        href={proj.projectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-cyan-400 hover:underline"
                      >
                        <span>Visit Site</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-12 border border-dashed border-slate-800 rounded-2xl">
                <Code2 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">No projects published yet.</p>
              </div>
            )}
          </div>
        </section>

        {/* ── Skills & Technologies Section ── */}
        <section id="skills" className="space-y-8 scroll-mt-20">
          <div className="border-b border-slate-800 pb-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
              <Layers className="w-3.5 h-3.5" />
              <span>Core Stack</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Technical Proficiencies
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {skillCategories.map((group) => (
              <div
                key={group.category}
                className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <h3 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>{group.category}</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800/80 text-slate-200 border border-slate-700/60 hover:border-cyan-500/40 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── About & Experience Highlights ── */}
        <section id="about" className="space-y-8 scroll-mt-20">
          <div className="border-b border-slate-800 pb-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Background</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              About &amp; Experience
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bio Card */}
            <div className="md:col-span-2 p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-white">Professional Journey</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{displayBio}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>
                    {[owner?.city, owner?.country].filter(Boolean).join(', ') ||
                      'Dhaka, Bangladesh'}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <GraduationCap className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <span>B.Sc. in Computer Science &amp; Engineering</span>
                </div>
              </div>
            </div>

            {/* Languages & Working Style */}
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
              <h3 className="text-lg font-bold text-white">Languages &amp; Culture</h3>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="font-semibold text-slate-200">Bangla</div>
                  <div className="text-slate-400">Native</div>
                </div>
                <div>
                  <div className="font-semibold text-slate-200">English</div>
                  <div className="text-slate-400">Full working proficiency</div>
                </div>
                <div className="pt-2 border-t border-slate-800">
                  <div className="font-semibold text-cyan-400">Work Methodology</div>
                  <div className="text-slate-400 mt-0.5">
                    Agile/Scrum, Code Review, Reusable Components, Clean Architecture
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Contact Section ── */}
        <section id="contact" className="scroll-mt-20">
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-[#0b101c] to-slate-950 border border-slate-800 p-8 sm:p-12 text-center space-y-6 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="max-w-2xl mx-auto space-y-3 relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Send className="w-3.5 h-3.5" />
                <span>Let&apos;s Connect</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Let&apos;s build something remarkable together.
              </h2>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Whether you have an upcoming project, want to discuss enterprise web solutions, or
                are looking for a committed team player — feel free to reach out.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 relative z-10 pt-2">
              {owner?.phone && (
                <a
                  href={`tel:${owner.phone}`}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors"
                >
                  <span>{owner.phone}</span>
                </a>
              )}
              {owner?.linkedin && (
                <a
                  href={
                    owner.linkedin.startsWith('http') ? owner.linkedin : `https://${owner.linkedin}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all hover:scale-105"
                >
                  <LinkedinIcon className="w-4 h-4" />
                  <span>Connect on LinkedIn</span>
                </a>
              )}
              {owner?.github && (
                <a
                  href={owner.github.startsWith('http') ? owner.github : `https://${owner.github}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all hover:scale-105"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>View GitHub</span>
                </a>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-900 bg-[#05080e] py-8 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            © {new Date().getFullYear()} {fullName}. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <a href="#hero" className="hover:text-cyan-400 transition-colors">
              Back to top ↑
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
