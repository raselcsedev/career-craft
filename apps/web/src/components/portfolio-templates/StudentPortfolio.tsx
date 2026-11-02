'use client';

import React from 'react';
import { PublicPortfolioData } from '@/types/portfolio';
import { GraduationCap, ExternalLink, BookOpen, Sparkles } from 'lucide-react';

export function StudentPortfolio({ data }: { data: PublicPortfolioData }) {
  const { title, bio, themeConfig, projects, owner } = data;
  const fullName = `${owner?.firstName || ''} ${owner?.lastName || ''}`.trim() || title;

  return (
    <div className="min-h-screen bg-sky-50/40 text-gray-800 font-sans">
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">
        {/* Friendly Hero */}
        <header className="bg-white rounded-3xl border border-sky-100 p-8 sm:p-12 shadow-sm text-center space-y-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold mx-auto">
            <GraduationCap className="w-4 h-4 text-sky-600" />
            <span>Graduate / Student Showcase</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
            Hi, I&apos;m {fullName} 👋
          </h1>

          {owner?.headline && (
            <p className="text-lg font-medium text-sky-700">
              {owner.headline}
            </p>
          )}

          <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            {bio || owner?.bio}
          </p>

          <div className="pt-4 flex items-center justify-center gap-3">
            {owner?.github && (
              <a
                href={owner.github}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 transition-colors"
              >
                GitHub
              </a>
            )}
            {owner?.linkedin && (
              <a
                href={owner.linkedin}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-semibold hover:bg-sky-700 transition-colors"
              >
                LinkedIn
              </a>
            )}
          </div>
        </header>

        {/* Academic & Personal Projects */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-sky-600" />
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Projects &amp; Coursework</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects && projects.length > 0 ? (
              projects.map((proj) => (
                <div
                  key={proj.id}
                  className="bg-white rounded-2xl border border-sky-100 p-6 shadow-sm hover:border-sky-300 transition-colors flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <h3 className="font-bold text-base text-gray-900">{proj.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">{proj.description}</p>
                  </div>

                  <div className="pt-6 space-y-4">
                    <div className="flex flex-wrap gap-1.5">
                      {proj.technologies?.map((tech, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-full bg-sky-50 text-[11px] font-medium text-sky-700">
                          {tech}
                        </span>
                      ))}
                    </div>

                    {proj.projectUrl && (
                      <a
                        href={proj.projectUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-sky-600 hover:underline inline-flex items-center gap-1"
                      >
                        <span>View Project Demo</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-12 text-sm text-gray-400 bg-white rounded-2xl border border-dashed border-sky-100">
                No student projects published yet.
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-xs text-gray-400 pt-8 border-t border-sky-100">
          <p>© {new Date().getFullYear()} {fullName} • Created with CareerCraft</p>
        </footer>
      </div>
    </div>
  );
}
