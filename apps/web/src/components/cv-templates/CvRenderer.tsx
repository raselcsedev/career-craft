'use client';

import React from 'react';
import { CvContent, CvStyling } from '@/types/cv';
import { ClassicProfessional } from './ClassicProfessional';
import { ModernCorporate } from './ModernCorporate';
import { MinimalClean } from './MinimalClean';
import { CreativeAccent } from './CreativeAccent';
import { DeveloperTechnical } from './DeveloperTechnical';
import { StudentGraduate } from './StudentGraduate';

interface CvRendererProps {
  content: CvContent;
  styling?: CvStyling;
  templateSlug?: string;
  className?: string;
}

export function CvRenderer({ content, styling, templateSlug = 'classic-professional', className = '' }: CvRendererProps) {
  const normalizedSlug = templateSlug?.toLowerCase() || 'classic-professional';

  return (
    <div className={`cv-printable-page bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200/80 transition-all ${className}`}>
      {normalizedSlug === 'classic-professional' && (
        <ClassicProfessional content={content} styling={styling} />
      )}
      {normalizedSlug === 'modern-corporate' && (
        <ModernCorporate content={content} styling={styling} />
      )}
      {normalizedSlug === 'minimal' && (
        <MinimalClean content={content} styling={styling} />
      )}
      {normalizedSlug === 'creative' && (
        <CreativeAccent content={content} styling={styling} />
      )}
      {normalizedSlug === 'developer' && (
        <DeveloperTechnical content={content} styling={styling} />
      )}
      {normalizedSlug === 'student-graduate' && (
        <StudentGraduate content={content} styling={styling} />
      )}
      {/* Fallback to classic if slug didn't match */}
      {![
        'classic-professional',
        'modern-corporate',
        'minimal',
        'creative',
        'developer',
        'student-graduate',
      ].includes(normalizedSlug) && (
        <ClassicProfessional content={content} styling={styling} />
      )}
    </div>
  );
}
