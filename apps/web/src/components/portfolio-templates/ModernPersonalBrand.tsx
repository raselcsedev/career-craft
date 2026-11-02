'use client';

import React from 'react';
import { PublicPortfolioData } from '@/types/portfolio';
import { Sparkles, ArrowRight, ExternalLink, Globe, MapPin } from 'lucide-react';

export function ModernPersonalBrand({ data }: { data: PublicPortfolioData }) {
  const { title, bio, themeConfig, projects, owner } = data;
  const fullName = `${owner?.firstName || ''} ${owner?.lastName || ''}`.trim() || title;

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-indigo-600 selection:text-white">
      {/* Brand Hero */}
      <div className="border-b border-gray-100 bg-gradient-to-b from-indigo-50/40 via-white to-white">
        <div className="max-w-4xl mx-auto px-6 py-24 space-y-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Personal Brand &amp; Independent Consultant</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-950">
            {fullName}
          </h1>

          {owner?.headline && (
            <p className="text-xl sm:text-2xl text-indigo-900 font-medium max-w-2xl mx-auto">
              {owner.headline}
            </p>
          )}

          <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            {bio || owner?.bio}
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-gray-600">
            {owner?.city && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-indigo-500" />
                {owner.city}{owner.country ? `, ${owner.country}` : ''}
              </span>
            )}
            {owner?.website && (
              <a href={owner.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-indigo-600">
                <Globe className="w-4 h-4 text-indigo-500" />
                {owner.website.replace(/^https?:\/\//, '')}
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">
        {/* Featured Case Studies */}
        <section className="space-y-8">
          <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Featured Work</h2>
            <span className="text-xs text-gray-400">Products &amp; Case Studies</span>
          </div>

          <div className="space-y-6">
            {projects && projects.length > 0 ? (
              projects.map((proj) => (
                <div
                  key={proj.id}
                  className="rounded-2xl border border-gray-200/80 p-6 sm:p-8 hover:border-indigo-300 hover:shadow-sm transition-all bg-white flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-900">{proj.title}</h3>
                      {proj.isFeatured && (
                        <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{proj.description}</p>
                  </div>

                  <div className="pt-6 border-t border-gray-100 mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-1.5">
                      {proj.technologies?.map((tech, idx) => (
                        <span key={idx} className="px-2.5 py-0.5 rounded-md bg-gray-100 text-xs font-medium text-gray-700">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 text-xs font-semibold">
                      {proj.projectUrl && (
                        <a
                          href={proj.projectUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-600 hover:underline inline-flex items-center gap-1"
                        >
                          <span>Explore Project</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-sm text-gray-400 border border-dashed border-gray-200 rounded-2xl">
                No featured case studies published yet.
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-100 pt-8 pb-4 flex items-center justify-between text-xs text-gray-500">
          <p>© {new Date().getFullYear()} {fullName}</p>
          <p>Powered by CareerCraft</p>
        </footer>
      </div>
    </div>
  );
}
