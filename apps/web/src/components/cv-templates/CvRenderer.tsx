'use client';

import React from 'react';
import { CvContent, CvStyling } from '@/types/cv';
import { ClassicProfessional } from './ClassicProfessional';
import { ModernCorporate } from './ModernCorporate';
import { MinimalClean } from './MinimalClean';
import { CreativeAccent } from './CreativeAccent';
import { DeveloperTechnical } from './DeveloperTechnical';
import { StudentGraduate } from './StudentGraduate';
import { ExecutiveBanner } from './ExecutiveBanner';
import { ModernEdge } from './ModernEdge';

interface CvRendererProps {
  content: CvContent;
  styling?: CvStyling;
  templateSlug?: string;
  className?: string;
}

export function CvRenderer({
  content,
  styling,
  templateSlug = 'executive-banner',
  className = '',
}: CvRendererProps) {
  const normalizedSlug = templateSlug?.toLowerCase() || 'executive-banner';

  return (
    <div
      className={`cv-printable-page bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200/80 transition-all ${className}`}
    >
      {(normalizedSlug === 'executive-banner' || normalizedSlug === 'executive') && (
        <ExecutiveBanner content={content} styling={styling} />
      )}
      {(normalizedSlug === 'modern-edge' || normalizedSlug === 'edge') && (
        <ModernEdge content={content} styling={styling} />
      )}
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
      {/* Fallback */}
      {![
        'executive-banner',
        'executive',
        'modern-edge',
        'edge',
        'classic-professional',
        'modern-corporate',
        'minimal',
        'creative',
        'developer',
        'student-graduate',
      ].includes(normalizedSlug) && (
        <ExecutiveBanner content={content} styling={styling} />
      )}
    </div>
  );
}
