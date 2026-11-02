'use client';

import React from 'react';
import { PublicPortfolioData } from '@/types/portfolio';
import { MinimalDeveloper } from './MinimalDeveloper';
import { DarkCreative } from './DarkCreative';
import { ProfessionalCorporate } from './ProfessionalCorporate';
import { DesignerVisual } from './DesignerVisual';
import { StudentPortfolio } from './StudentPortfolio';
import { ModernPersonalBrand } from './ModernPersonalBrand';

export function PortfolioRenderer({
  data,
  templateSlug,
}: {
  data: PublicPortfolioData;
  templateSlug?: string;
}) {
  const activeSlug = templateSlug || data.template?.slug || 'minimal-developer';

  switch (activeSlug) {
    case 'dark-creative':
      return <DarkCreative data={data} />;
    case 'professional-corporate':
      return <ProfessionalCorporate data={data} />;
    case 'designer-visual':
      return <DesignerVisual data={data} />;
    case 'student-portfolio':
      return <StudentPortfolio data={data} />;
    case 'modern-personal-brand':
      return <ModernPersonalBrand data={data} />;
    case 'minimal-developer':
    default:
      return <MinimalDeveloper data={data} />;
  }
}
