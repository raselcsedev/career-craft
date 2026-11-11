import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Seed CV Templates
  const cvTemplates = [
    {
      slug: 'executive-banner',
      name: 'Executive Banner',
      description: 'Header banner with photo, centered pill section headers, two-column timeline, and categorized skills grid.',
      layout: 'executive-banner',
      thumbnail: '/templates/cv/executive-banner.png',
      isActive: true,
    },
    {
      slug: 'modern-edge',
      name: 'Modern Edge',
      description: 'Sleek tech lead layout with gradient top accent, dual-column metrics split, and skill tags.',
      layout: 'modern-edge',
      thumbnail: '/templates/cv/modern-edge.png',
      isActive: true,
    },
    {
      slug: 'classic-professional',
      name: 'Classic Professional',
      description: 'Traditional, elegant single-column format optimized for corporate, finance, and ATS friendliness.',
      layout: 'single-column',
      thumbnail: '/templates/cv/classic-professional.png',
      isActive: true,
    },
    {
      slug: 'modern-corporate',
      name: 'Modern Corporate',
      description: 'Sleek two-column header with distinct sidebar for skills and credentials.',
      layout: 'two-column-sidebar',
      thumbnail: '/templates/cv/modern-corporate.png',
      isActive: true,
    },
    {
      slug: 'minimal',
      name: 'Minimal',
      description: 'Clean typographic layout with generous whitespace for understated elegance.',
      layout: 'minimal-clean',
      thumbnail: '/templates/cv/minimal.png',
      isActive: true,
    },
    {
      slug: 'creative',
      name: 'Creative',
      description: 'Dynamic accents and bold section headers for designers, marketers, and art directors.',
      layout: 'creative-accent',
      thumbnail: '/templates/cv/creative.png',
      isActive: true,
    },
    {
      slug: 'developer',
      name: 'Developer',
      description: 'Monospace touches, prominent GitHub/portfolio links, and structured technical skill chips.',
      layout: 'developer-technical',
      thumbnail: '/templates/cv/developer.png',
      isActive: true,
    },
    {
      slug: 'student-graduate',
      name: 'Student / Graduate',
      description: 'Highlights education, projects, coursework, and extracurricular leadership first.',
      layout: 'education-first',
      thumbnail: '/templates/cv/student-graduate.png',
      isActive: true,
    },
  ];

  for (const template of cvTemplates) {
    await prisma.cvTemplate.upsert({
      where: { slug: template.slug },
      update: template,
      create: template,
    });
  }
  console.log(`✅ Seeded ${cvTemplates.length} CV templates`);

  // 2. Seed Portfolio Templates
  const portfolioTemplates = [
    {
      slug: 'developer-showcase',
      name: 'Developer Showcase Pro',
      description: 'Modern dark tech portfolio with ambient glows, live availability indicator, project showcase, and categorized stack.',
      layout: 'developer-showcase',
      thumbnail: '/templates/portfolio/developer-showcase.png',
      isActive: true,
    },
    {
      slug: 'bento-modern',
      name: 'Bento Modern Grid',
      description: 'Apple/Linear-style interactive bento grid showcasing bio, live status, project cards, and tech stack matrix.',
      layout: 'bento-grid',
      thumbnail: '/templates/portfolio/bento-modern.png',
      isActive: true,
    },
    {
      slug: 'minimal-developer',
      name: 'Minimal Developer',
      description: 'Terminal-inspired clean dark/light portfolio focusing on code, stack, and live project cards.',
      layout: 'developer-grid',
      thumbnail: '/templates/portfolio/minimal-developer.png',
      isActive: true,
    },
    {
      slug: 'dark-creative',
      name: 'Dark Creative',
      description: 'Moody, high-contrast visual portfolio featuring large hero banners and spotlight interactions.',
      layout: 'creative-spotlight',
      thumbnail: '/templates/portfolio/dark-creative.png',
      isActive: true,
    },
    {
      slug: 'professional-corporate',
      name: 'Professional Corporate',
      description: 'Polished executive layout for consultants, managers, and senior business professionals.',
      layout: 'corporate-timeline',
      thumbnail: '/templates/portfolio/professional-corporate.png',
      isActive: true,
    },
    {
      slug: 'designer-visual',
      name: 'Designer / Visual Portfolio',
      description: 'Masonry gallery showcase prioritizing visuals, case studies, and design system breakdowns.',
      layout: 'masonry-gallery',
      thumbnail: '/templates/portfolio/designer-visual.png',
      isActive: true,
    },
    {
      slug: 'student-portfolio',
      name: 'Student Portfolio',
      description: 'Friendly, accessible presentation highlighting academic milestones, coursework, and ambition.',
      layout: 'academic-cards',
      thumbnail: '/templates/portfolio/student-portfolio.png',
      isActive: true,
    },
    {
      slug: 'modern-personal-brand',
      name: 'Modern Personal Brand',
      description: 'Story-driven single-page narrative with bold typography and prominent contact callouts.',
      layout: 'brand-narrative',
      thumbnail: '/templates/portfolio/modern-personal-brand.png',
      isActive: true,
    },
  ];

  for (const template of portfolioTemplates) {
    await prisma.portfolioTemplate.upsert({
      where: { slug: template.slug },
      update: template,
      create: template,
    });
  }
  console.log(`✅ Seeded ${portfolioTemplates.length} Portfolio templates`);

  // 3. Seed Demo User
  const demoEmail = 'demo@careercraft.com';
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  const demoUser = await prisma.user.upsert({
    where: { email: demoEmail },
    update: {},
    create: {
      email: demoEmail,
      passwordHash: hashedPassword,
      profile: {
        create: {
          firstName: 'Alex',
          lastName: 'Morgan',
          headline: 'Full-Stack Software Engineer & Open Source Contributor',
          bio: 'Passionate software engineer building resilient distributed systems and intuitive user interfaces. Over 5 years of experience in TypeScript, React, and cloud architectures.',
          phone: '+1 (555) 019-2834',
          city: 'San Francisco',
          country: 'United States',
          website: 'https://alexmorgan.dev',
          github: 'https://github.com/alexmorgan',
          linkedin: 'https://linkedin.com/in/alexmorgan',
        },
      },
    },
    include: {
      profile: true,
    },
  });

  console.log(`✅ Seeded Demo user: ${demoUser.email} (Password: Password123!)`);
  console.log('🎉 Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
