'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface SummaryFormProps {
  value: string;
  onChange: (value: string) => void;
}

export function SummaryForm({ value, onChange }: SummaryFormProps) {
  const suggestions = [
    'Results-driven software engineer with 5+ years of experience designing scalable microservices and frontend architectures.',
    'Creative brand designer passionate about building cohesive visual identities, design systems, and delightful digital user journeys.',
    'Recent Computer Science graduate with strong foundational knowledge in data structures, algorithms, and full-stack web development.',
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Professional Summary / Objective
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Write a concise 2–4 sentence summary highlighting your core strengths, achievements, and what sets you apart.
        </p>
        <textarea
          rows={5}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. Dedicated professional with 4+ years of expertise in delivering scalable web applications, optimizing databases, and leading collaborative engineering teams..."
          className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-gray-400"
        />
        <div className="flex justify-between items-center text-xs text-gray-400 mt-1.5">
          <span>{value ? value.split(/\s+/).filter(Boolean).length : 0} words</span>
          <span>Recommended: 40–80 words</span>
        </div>
      </div>

      <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-900 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          Quick Inspirations (Click to insert):
        </div>
        <div className="space-y-2">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onChange(s)}
              className="w-full text-left p-2 rounded-lg bg-white border border-indigo-100 text-xs text-indigo-900 hover:bg-indigo-50 transition-colors cursor-pointer"
            >
              &ldquo;{s}&rdquo;
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
