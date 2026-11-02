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
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 bg-gradient-to-b from-indigo-50/50 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100/70 text-indigo-700 text-xs font-semibold mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Full-Stack CV Builder &amp; Personal Portfolio Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 max-w-4xl mx-auto leading-tight">
            Build Winning CVs &amp; Personal Portfolios{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-800 bg-clip-text text-transparent">
              That Land Interviews
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto font-normal">
            Enter your career details once. Instantly generate ATS-ready resumes, preview 6+ distinct templates, and
            publish your custom portfolio website with a unique public URL.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-indigo-200" rightIcon={<ArrowRight className="w-4 h-4" />}>
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
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-medium text-gray-500">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Free to Start
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> One Profile, Multiple CVs
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Real PDF Export
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Live Public Portfolios
            </span>
          </div>

          {/* Hero Visual Mockup */}
          <div className="mt-16 relative max-w-5xl mx-auto rounded-2xl border border-gray-200/80 bg-white p-3 sm:p-5 shadow-2xl shadow-indigo-100">
            <div className="rounded-xl bg-gray-900 p-4 sm:p-8 text-left text-white grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <Badge variant="success">Interactive Platform</Badge>
                <h3 className="text-2xl font-bold tracking-tight">Real-Time Split Editor &amp; Live PDF Preview</h3>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Edit personal info, experience, skills, and certifications on the left. See the exact print-ready CV
                  refresh instantly on the right without page reloads.
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <div className="px-3 py-1 rounded bg-gray-800 text-xs font-mono text-indigo-300">
                    GET /api/v1/cvs
                  </div>
                  <div className="px-3 py-1 rounded bg-gray-800 text-xs font-mono text-emerald-300">
                    MySQL + Prisma
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 text-gray-800 shadow-inner space-y-3 font-sans">
                <div className="border-b pb-3">
                  <h4 className="font-bold text-lg text-gray-900">Alex Morgan</h4>
                  <p className="text-xs text-indigo-600 font-medium">Senior Full-Stack Engineer</p>
                  <p className="text-[11px] text-gray-500">alex@careercraft.com • San Francisco, CA • github.com/alex</p>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="font-semibold text-gray-700 uppercase tracking-wider text-[10px]">Experience</div>
                  <p className="font-medium text-gray-900">Lead Systems Architect — Acme Corp (2022 - Present)</p>
                  <p className="text-gray-500 text-[11px]">Scaled distributed microservices using NestJS, MySQL &amp; React.</p>
                </div>
                <div className="pt-2 flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-gray-100 text-[10px] font-medium text-gray-700">TypeScript</span>
                  <span className="px-2 py-0.5 rounded bg-gray-100 text-[10px] font-medium text-gray-700">Next.js</span>
                  <span className="px-2 py-0.5 rounded bg-gray-100 text-[10px] font-medium text-gray-700">NestJS</span>
                  <span className="px-2 py-0.5 rounded bg-gray-100 text-[10px] font-medium text-gray-700">Prisma</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section id="features" className="py-20 bg-gray-50/60 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Features</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything You Need to Showcase Your Career
            </p>
            <p className="mt-4 text-gray-600">
              Designed from the ground up for professionals, software engineers, creatives, and new graduates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-gray-900">Single Reusable Profile</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Fill in your work experience, education, skills, and links once. Create tailored CVs for different jobs
                  without retyping your history.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center">
                  <Download className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-gray-900">Real PDF Downloads</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Export high-fidelity, selectable, printable PDFs with clean margins and ATS-conscious layouts ready for
                  job portals.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Globe className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-gray-900">Public Portfolio Websites</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Claim your unique slug (e.g. <code>/p/alex</code>) and publish your project portfolio. Accessible to
                  anyone without login.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CV Templates Showcase */}
      <section id="cv-templates" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">CV Templates</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                6 Distinct, Production-Tested Layouts
              </p>
              <p className="mt-2 text-gray-500 text-sm">
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
                    <h3 className="font-bold text-gray-900">{tmpl.name}</h3>
                    <Badge variant="neutral">{tmpl.tag}</Badge>
                  </div>
                  <p className="text-sm text-gray-500">{tmpl.desc}</p>
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-indigo-600 font-medium">
                    <span>Includes PDF Export</span>
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
      <section id="portfolio-templates" className="py-20 bg-gray-50/60 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Portfolio Builder</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Turn Your Profile Into a Live Personal Website
            </p>
            <p className="mt-4 text-gray-600">
              Pick a design, customize theme colors, add projects, and publish with a unique link.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PORTFOLIO_TEMPLATES.map((tmpl) => (
              <Card key={tmpl.name} className="hover:border-indigo-200 hover:shadow-md transition-all">
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">{tmpl.name}</h3>
                    <Badge variant="default">{tmpl.badge}</Badge>
                  </div>
                  <p className="text-sm text-gray-500">{tmpl.desc}</p>
                  <div className="pt-3 text-xs text-gray-400">
                    Ready for custom domain &amp; public slug
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Take Your Career to the Next Level?
          </h2>
          <p className="text-indigo-100 max-w-2xl mx-auto text-base sm:text-lg">
            Create an account in 30 seconds. Start crafting your professional CV and personal website today.
          </p>
          <div className="pt-4 flex items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 shadow-md">
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
