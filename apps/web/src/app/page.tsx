'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import {
  FileText,
  Globe,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Download,
  Layers,
  Palette,
  Eye,
  ShieldCheck,
  Zap,
} from 'lucide-react';

const CV_TEMPLATES = [
  {
    name: 'Classic Professional',
    slug: 'classic-professional',
    desc: 'ATS-conscious single-column elegance for corporate and finance roles.',
    tag: 'Popular',
    accent: 'border-blue-500',
  },
  {
    name: 'Modern Corporate',
    slug: 'modern-corporate',
    desc: 'Structured two-column header with distinct sidebar for skills and credentials.',
    tag: 'Executive',
    accent: 'border-indigo-500',
  },
  {
    name: 'Minimal',
    slug: 'minimal',
    desc: 'Understated typographic simplicity with generous whitespace.',
    tag: 'Clean',
    accent: 'border-gray-500',
  },
  {
    name: 'Creative',
    slug: 'creative',
    desc: 'Bold accents and expressive section headers for design and marketing.',
    tag: 'Designers',
    accent: 'border-pink-500',
  },
  {
    name: 'Developer',
    slug: 'developer',
    desc: 'Tech-focused monospace styling, GitHub chips, and project links.',
    tag: 'Engineers',
    accent: 'border-emerald-500',
  },
  {
    name: 'Student / Graduate',
    slug: 'student-graduate',
    desc: 'Prioritizes education, academic projects, leadership, and coursework.',
    tag: 'Academic',
    accent: 'border-amber-500',
  },
];

const PORTFOLIO_TEMPLATES = [
  {
    name: 'Minimal Developer',
    desc: 'Terminal-inspired clean layout focusing on stack, GitHub, and live apps.',
    badge: 'Code Focus',
  },
  {
    name: 'Dark Creative',
    desc: 'High-contrast dark mode with spotlight effects and bold banners.',
    badge: 'High Impact',
  },
  {
    name: 'Professional Corporate',
    desc: 'Polished timeline narrative tailored for consultants and senior leaders.',
    badge: 'Consulting',
  },
  {
    name: 'Designer / Visual',
    desc: 'Masonry gallery showcase for UI/UX case studies and visual assets.',
    badge: 'Portfolio',
  },
  {
    name: 'Student Portfolio',
    desc: 'Friendly presentation highlighting coursework, ambition, and milestones.',
    badge: 'Entry Level',
  },
  {
    name: 'Modern Personal Brand',
    desc: 'Story-driven single-page narrative with typography-first layout.',
    badge: 'Branding',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0b1526] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 bg-gradient-to-b from-[#A0E0EF]/15 via-white dark:via-[#0b1526] to-white dark:to-[#0b1526]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#A0E0EF]/25 dark:bg-[#005A9C]/20 border border-[#A0E0EF]/60 dark:border-[#005A9C]/40 text-[#005A9C] dark:text-[#60C1E5] text-xs font-semibold mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Full-Stack CV Builder &amp; Personal Portfolio Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
            Build Winning CVs &amp; Personal Portfolios{' '}
            <span className="bg-gradient-to-r from-[#1B365D] via-[#005A9C] to-[#60C1E5] dark:from-[#60C1E5] dark:via-[#A0E0EF] dark:to-white bg-clip-text text-transparent">
              That Land Interviews
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal">
            Enter your career details once. Instantly generate ATS-ready resumes, preview 6+ distinct templates, and
            publish your custom portfolio website with a unique public URL.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-[#005A9C]/20" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Start Building Free
              </Button>
            </Link>
            <Link href="/#cv-templates" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Explore Templates
              </Button>
            </Link>
          </div>

          {/* Quick Features Row */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Free to Start
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> One Profile, Multiple CVs
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Direct PDF &amp; Word Export
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Live Public Portfolios
            </span>
          </div>

          {/* Hero Visual Mockup */}
          <div className="mt-16 relative max-w-5xl mx-auto rounded-2xl border border-slate-200/80 dark:border-[#1B365D] bg-white dark:bg-[#101f38] p-3 sm:p-5 shadow-2xl shadow-[#005A9C]/10">
            <div className="rounded-xl bg-[#0b1526] border border-[#1B365D] p-4 sm:p-8 text-left text-white grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <Badge variant="success">Interactive Platform</Badge>
                <h3 className="text-2xl font-bold tracking-tight">Real-Time Split Editor &amp; Live PDF Preview</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Edit personal info, experience, skills, and certifications on the left. See the exact print-ready CV
                  refresh instantly on the right without page reloads.
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <div className="px-3 py-1 rounded bg-[#162a4a] text-xs font-mono text-[#60C1E5]">
                    GET /api/v1/cvs
                  </div>
                  <div className="px-3 py-1 rounded bg-[#162a4a] text-xs font-mono text-emerald-300">
                    MySQL + Prisma
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 text-slate-800 shadow-inner space-y-3 font-sans">
                <div className="border-b border-slate-200 pb-3">
                  <h4 className="font-bold text-lg text-slate-900">Alex Morgan</h4>
                  <p className="text-xs text-[#005A9C] font-semibold">Senior Full-Stack Engineer</p>
                  <p className="text-[11px] text-slate-500">alex@careercraft.com • San Francisco, CA • github.com/alex</p>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="font-semibold text-slate-700 uppercase tracking-wider text-[10px]">Experience</div>
                  <p className="font-medium text-slate-900">Lead Systems Architect — Acme Corp (2022 - Present)</p>
                  <p className="text-slate-500 text-[11px]">Scaled distributed microservices using NestJS, MySQL &amp; React.</p>
                </div>
                <div className="pt-2 flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-medium text-slate-700">TypeScript</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-medium text-slate-700">Next.js</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-medium text-slate-700">NestJS</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-medium text-slate-700">Prisma</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section id="features" className="py-20 bg-slate-50/60 dark:bg-[#0d1726] border-y border-slate-200/80 dark:border-[#1B365D]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-semibold text-[#005A9C] dark:text-[#60C1E5] uppercase tracking-wider">Features</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Everything You Need to Showcase Your Career
            </p>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Designed from the ground up for professionals, software engineers, creatives, and new graduates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-[#A0E0EF]/25 dark:bg-[#005A9C]/25 text-[#005A9C] dark:text-[#60C1E5] flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Single Reusable Profile</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Fill in your work experience, education, skills, and links once. Create tailored CVs for different jobs
                  without retyping your history.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-[#A0E0EF]/25 dark:bg-[#005A9C]/25 text-[#005A9C] dark:text-[#60C1E5] flex items-center justify-center">
                  <Download className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Real PDF &amp; Word Downloads</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Export high-fidelity, selectable, printable PDFs and editable Word DOCX files with clean margins and ATS-conscious layouts.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-[#A0E0EF]/25 dark:bg-[#005A9C]/25 text-[#005A9C] dark:text-[#60C1E5] flex items-center justify-center">
                  <Globe className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Public Portfolio Websites</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Claim your unique slug (e.g. <code>/p/alex</code>) and publish your project portfolio. Accessible to
                  anyone without login.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CV Templates Showcase */}
      <section id="cv-templates" className="py-20 bg-white dark:bg-[#0b1526] transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-xs font-semibold text-[#005A9C] dark:text-[#60C1E5] uppercase tracking-wider">CV Templates</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                6 Distinct, Production-Tested Layouts
              </p>
              <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm">
                Switch templates anytime with one click — your CV content is always preserved.
              </p>
            </div>
            <Link href="/register" className="mt-4 md:mt-0">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Use These Templates
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CV_TEMPLATES.map((tmpl) => (
              <Card key={tmpl.slug} className={`border-t-4 ${tmpl.accent} hover:shadow-lg transition-all`}>
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 dark:text-white">{tmpl.name}</h3>
                    <Badge variant="neutral">{tmpl.tag}</Badge>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{tmpl.desc}</p>
                  <div className="pt-4 border-t border-slate-100 dark:border-[#1B365D] flex items-center justify-between text-xs text-[#005A9C] dark:text-[#60C1E5] font-medium">
                    <span>Includes PDF &amp; DOCX Export</span>
                    <Link href="/register" className="hover:underline flex items-center gap-1">
                      Start with this →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Templates Showcase */}
      <section id="portfolio-templates" className="py-20 bg-slate-50/60 dark:bg-[#0d1726] border-t border-slate-200/80 dark:border-[#1B365D] transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-semibold text-[#005A9C] dark:text-[#60C1E5] uppercase tracking-wider">Portfolio Builder</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Turn Your Profile Into a Live Personal Website
            </p>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Pick a design, customize theme colors, add projects, and publish with a unique link.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PORTFOLIO_TEMPLATES.map((tmpl) => (
              <Card key={tmpl.name} className="hover:border-[#005A9C] dark:hover:border-[#60C1E5] hover:shadow-md transition-all">
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 dark:text-white">{tmpl.name}</h3>
                    <Badge variant="default">{tmpl.badge}</Badge>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{tmpl.desc}</p>
                  <div className="pt-3 text-xs text-slate-400 dark:text-slate-500">
                    Ready for custom domain &amp; public slug
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-[#1B365D] via-[#005A9C] to-[#1B365D] text-white shadow-xl border-y border-[#005A9C]/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Ready to Take Your Career to the Next Level?
          </h2>
          <p className="text-[#A0E0EF] max-w-2xl mx-auto text-base sm:text-lg">
            Create an account in 30 seconds. Start crafting your professional CV and personal website today.
          </p>
          <div className="pt-4 flex items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="bg-white text-[#1B365D] hover:bg-[#A0E0EF] hover:text-[#1B365D] font-bold shadow-md border-none">
                Create Free Account
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="border-white/40 text-white hover:bg-white/10">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
