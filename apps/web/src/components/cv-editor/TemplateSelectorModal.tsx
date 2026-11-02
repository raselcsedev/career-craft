'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { CvTemplate } from '@/types/cv';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { X, Check, Layout, Sparkles, Loader2 } from 'lucide-react';

interface TemplateSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTemplateSlug: string;
  onSelect: (template: CvTemplate) => void;
  title?: string;
}

const FALLBACK_TEMPLATES: CvTemplate[] = [
  {
    id: 'classic-professional',
    slug: 'classic-professional',
    name: 'Classic Professional',
    description: 'Traditional, elegant single-column format optimized for corporate, finance, and ATS friendliness.',
    layout: 'single-column',
    isActive: true,
  },
  {
    id: 'modern-corporate',
    slug: 'modern-corporate',
    name: 'Modern Corporate',
    description: 'Sleek two-column header with distinct sidebar for skills and credentials.',
    layout: 'two-column-sidebar',
    isActive: true,
  },
  {
    id: 'minimal',
    slug: 'minimal',
    name: 'Minimal',
    description: 'Clean typographic layout with generous whitespace for understated elegance.',
    layout: 'minimal-clean',
    isActive: true,
  },
  {
    id: 'creative',
    slug: 'creative',
    name: 'Creative',
    description: 'Dynamic accents and bold section headers for designers, marketers, and art directors.',
    layout: 'creative-accent',
    isActive: true,
  },
  {
    id: 'developer',
    slug: 'developer',
    name: 'Developer',
    description: 'Monospace touches, prominent GitHub/portfolio links, and structured technical skill chips.',
    layout: 'developer-technical',
    isActive: true,
  },
  {
    id: 'student-graduate',
    slug: 'student-graduate',
    name: 'Student / Graduate',
    description: 'Highlights education, projects, coursework, and extracurricular leadership first.',
    layout: 'education-first',
    isActive: true,
  },
];

export function TemplateSelectorModal({
  isOpen,
  onClose,
  selectedTemplateSlug,
  onSelect,
  title = 'Choose CV Template',
}: TemplateSelectorModalProps) {
  const [templates, setTemplates] = useState<CvTemplate[]>(FALLBACK_TEMPLATES);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;
    setLoading(true);
    api
      .get<{ templates: CvTemplate[] }>('/cv-templates')
      .then((res) => {
        if (mounted && res?.templates && res.templates.length > 0) {
          setTemplates(res.templates);
        }
      })
      .catch((err) => {
        console.warn('Using fallback templates list:', err);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Select any design. All your resume content is fully preserved when switching.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-indigo-600 gap-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-sm font-medium">Loading templates...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((tpl) => {
                const isSelected =
                  tpl.slug.toLowerCase() === selectedTemplateSlug?.toLowerCase();

                return (
                  <div
                    key={tpl.id || tpl.slug}
                    onClick={() => {
                      onSelect(tpl);
                      onClose();
                    }}
                    className={`group relative rounded-xl border-2 p-4 cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/30 ring-2 ring-indigo-500/20 shadow-md'
                        : 'border-gray-200 hover:border-indigo-300 hover:shadow-md bg-white'
                    }`}
                  >
                    <div>
                      {/* Thumbnail Placeholder Preview */}
                      <div className="aspect-[4/3] rounded-lg bg-gray-100 mb-3.5 border border-gray-200/80 flex flex-col p-3 overflow-hidden relative group-hover:scale-[1.01] transition-transform">
                        {/* Mini mockup graphics */}
                        <div className="w-1/3 h-2 rounded-xs bg-gray-400 mb-2" />
                        <div className="w-1/2 h-1.5 rounded-xs bg-gray-300 mb-3" />
                        <div className="space-y-1.5 w-full">
                          <div className="w-full h-1 bg-gray-200 rounded-xs" />
                          <div className="w-4/5 h-1 bg-gray-200 rounded-xs" />
                          <div className="w-3/4 h-1 bg-gray-200 rounded-xs" />
                        </div>
                        <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-200/50">
                          <span className="text-[10px] font-mono text-gray-500 uppercase">
                            {tpl.layout}
                          </span>
                          <Layout className="w-3.5 h-3.5 text-gray-400" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-gray-900 text-sm">{tpl.name}</h3>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {tpl.description}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between">
                      <Badge variant="default" className="text-[10px] py-0 px-1.5">
                        {tpl.layout.replace('-', ' ')}
                      </Badge>
                      <span className="text-xs font-semibold text-indigo-600 group-hover:underline">
                        {isSelected ? 'Active' : 'Select →'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
