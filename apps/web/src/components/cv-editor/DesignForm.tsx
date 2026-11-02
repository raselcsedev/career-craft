'use client';

import React from 'react';
import { CvStyling } from '@/types/cv';
import { Palette, Type, Check } from 'lucide-react';

interface DesignFormProps {
  styling: CvStyling;
  onChange: (styling: CvStyling) => void;
}

const COLOR_SWATCHES = [
  { name: 'Classic Navy', value: '#1e3a8a' },
  { name: 'Indigo Accent', value: '#4f46e5' },
  { name: 'Teal Modern', value: '#0f766e' },
  { name: 'Emerald Fresh', value: '#059669' },
  { name: 'Creative Pink', value: '#ec4899' },
  { name: 'Sky Technical', value: '#0284c7' },
  { name: 'Academic Violet', value: '#7c3aed' },
  { name: 'Minimal Charcoal', value: '#18181b' },
  { name: 'Ruby Warmth', value: '#e11d48' },
  { name: 'Amber Gold', value: '#d97706' },
];

const FONTS: Array<{ label: string; value: CvStyling['fontFamily']; desc: string }> = [
  { label: 'Inter (Modern Sans)', value: 'Inter', desc: 'Clean, neutral, and highly readable.' },
  { label: 'Merriweather (Classic Serif)', value: 'Merriweather', desc: 'Authoritative, editorial, traditional.' },
  { label: 'Fira Code (Developer Mono)', value: 'Fira Code', desc: 'Tech-focused and developer friendly.' },
];

export function DesignForm({ styling, onChange }: DesignFormProps) {
  const currentColor = styling?.primaryColor || '#4f46e5';
  const currentFont = styling?.fontFamily || 'Inter';

  const handleColorChange = (color: string) => {
    onChange({
      ...styling,
      primaryColor: color,
    });
  };

  const handleFontChange = (font: CvStyling['fontFamily']) => {
    onChange({
      ...styling,
      fontFamily: font,
    });
  };

  return (
    <div className="space-y-6">
      {/* Primary Color Section */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5 mb-1">
          <Palette className="w-4 h-4 text-indigo-600" />
          Accent & Primary Theme Color
        </h3>
        <p className="text-xs text-gray-500 mb-3">
          Used for headings, highlights, borders, and sidebar backgrounds across templates.
        </p>

        {/* Swatches */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 mb-3">
          {COLOR_SWATCHES.map((swatch) => (
            <button
              key={swatch.value}
              type="button"
              onClick={() => handleColorChange(swatch.value)}
              title={swatch.name}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform hover:scale-110 shadow-xs border cursor-pointer ${
                currentColor.toLowerCase() === swatch.value.toLowerCase()
                  ? 'ring-2 ring-offset-2 ring-indigo-500 border-transparent scale-105'
                  : 'border-black/10'
              }`}
              style={{ backgroundColor: swatch.value }}
            >
              {currentColor.toLowerCase() === swatch.value.toLowerCase() && (
                <Check className="w-4 h-4 text-white drop-shadow-xs" />
              )}
            </button>
          ))}
        </div>

        {/* Custom Hex input */}
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={currentColor}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-9 h-9 rounded-lg border border-gray-300 cursor-pointer p-0.5 bg-white"
          />
          <input
            type="text"
            value={currentColor}
            onChange={(e) => handleColorChange(e.target.value)}
            placeholder="#4f46e5"
            className="w-32 px-3 py-1.5 text-xs font-mono uppercase border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <span className="text-xs text-gray-400">Custom Hex Code</span>
        </div>
      </div>

      {/* Typography Section */}
      <div className="pt-4 border-t border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5 mb-1">
          <Type className="w-4 h-4 text-indigo-600" />
          Typography Font Family
        </h3>
        <p className="text-xs text-gray-500 mb-3">
          Choose a typographic pairing tailored to your industry.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {FONTS.map((font) => (
            <div
              key={font.value}
              onClick={() => handleFontChange(font.value)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                currentFont === font.value
                  ? 'border-indigo-600 bg-indigo-50/40 ring-1 ring-indigo-600 shadow-2xs'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-gray-900">{font.label}</span>
                {currentFont === font.value && (
                  <Check className="w-4 h-4 text-indigo-600" />
                )}
              </div>
              <p className="text-xs text-gray-500">{font.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
