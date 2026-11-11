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
          firstName: 'Md. Rasel',
          lastName: 'Aktar',
          headline: 'Frontend Developer | React.js | Next.js | Angular | TypeScript',
          bio: 'Frontend Developer with 4 years of professional experience building production web applications with React.js, Next.js, Angular, TypeScript, and JavaScript (ES6+). Strong in REST and GraphQL API integration, reusable component architecture, and responsive multilingual UI.',
          phone: '+8801768297822',
          city: 'Dhaka',
          country: 'Bangladesh',
          website: 'https://personal-website-six-chi-23.vercel.app/',
          github: 'https://github.com/raselcsedev',
          linkedin: 'https://linkedin.com/in/md-rasel-1a9957174/',
        },
      },
    },
    include: {
      profile: true,
    },
  });

  console.log(`✅ Seeded Demo user: ${demoUser.email} (Password: Password123!)`);

  // 4. Seed Sample CV with Executive Banner template
  const executiveTemplate = await prisma.cvTemplate.findUnique({
    where: { slug: 'executive-banner' },
  });

  if (executiveTemplate) {
    const existingCv = await prisma.cv.findFirst({
      where: { userId: demoUser.id, title: 'Md. Rasel Aktar — Frontend Developer CV' },
    });

    if (!existingCv) {
      await prisma.cv.create({
        data: {
          userId: demoUser.id,
          templateId: executiveTemplate.id,
          title: 'Md. Rasel Aktar — Frontend Developer CV',
          content: {
            personalInfo: {
              fullName: 'MD. RASEL AKTAR',
              headline: 'Frontend Developer | React.js | Next.js | Angular | TypeScript',
              email: 'raselcse.dev@gmail.com',
              phone: '+8801768297822',
              city: 'Dhaka',
              country: 'Bangladesh',
              website: 'https://personal-website-six-chi-23.vercel.app/',
              github: 'https://github.com/raselcsedev',
              linkedin: 'https://linkedin.com/in/md-rasel-1a9957174/',
            },
            summary:
              'Frontend Developer with 4 years of professional experience building production web applications with React.js, Next.js, Angular, TypeScript, and JavaScript (ES6+). Delivered enterprise ERP systems, multi-vendor eCommerce platforms, and AI-powered products used by real businesses. Strong in REST and GraphQL API integration, reusable component architecture, state management, payment gateway integration, and responsive, multilingual UI. Works effectively in Agile, cross-functional teams.',
            experiences: [
              {
                id: 'exp-1',
                company: 'Digital Intelligence System Ltd.',
                position: 'Frontend Developer',
                location: 'Dhaka, Bangladesh',
                startDate: '11/2023',
                endDate: '',
                current: true,
                description:
                  '• Build and maintain enterprise ERP applications (Base ERP, Hatil ERP) using Angular, TypeScript, RxJS, Tailwind CSS, and TanStack Query.\n• Delivered frontend workflows across Sales, Purchase, and Inventory modules, including Sales Bills, Warehouse Bills, Repair Service, Dealer Money Receipts, Raw Material Purchases, and Finished Goods Receipts.\n• Migrated legacy React, AngularJS, and ASP.NET WebForms pages to Angular 17+ standalone components across sales, inventory, procurement, HR, and admin modules.\n• Integrated backend REST APIs and developed reusable, responsive UI components, including a configurable data-table component, for data-heavy enterprise workflows.\n• Develop multi-vendor and single-vendor eCommerce platforms (Quick eCommerce, Retail Master) using Next.js, TypeScript, Tailwind CSS, and TanStack Query.\n• Built and maintain 10+ industry-specific storefront themes (grocery, medicine, furniture, footwear, watches, lifestyle) with dynamic theming.\n• Integrated bKash and SSLCommerz payment gateways and implemented guest checkout, cash-on-delivery, multilingual (next-intl), and multi-currency functionality.\n• Developed Bizpost AI, an AI-powered social media content generation platform (Next.js, TypeScript) for creating Facebook, TikTok, and LinkedIn content.',
              },
              {
                id: 'exp-2',
                company: 'Gain Solutions Ltd.',
                position: 'JavaScript Developer',
                location: 'Dhaka, Bangladesh',
                startDate: '09/2022',
                endDate: '10/2023',
                current: false,
                description:
                  '• Developed frontend features for Unite Living, a house rental management system, using React.js, GraphQL, and Apollo Client.\n• Implemented CRUD functionality and integrated GraphQL APIs for application data management.\n• Built reusable, maintainable UI components that improved interface consistency across the application.\n• Collaborated with cross-functional team members in an Agile environment to deliver production-ready features.',
              },
            ],
            educations: [
              {
                id: 'edu-1',
                institution: 'University of South Asia',
                degree: 'B.Sc. in Computer Science and Engineering',
                field: 'Dhaka, Bangladesh',
                startDate: '05/2017',
                endDate: '04/2021',
              },
            ],
            skills: [
              { id: 'sk-1', name: 'JavaScript (ES6+)', category: 'Languages' },
              { id: 'sk-2', name: 'TypeScript', category: 'Languages' },
              { id: 'sk-3', name: 'HTML5', category: 'Languages' },
              { id: 'sk-4', name: 'CSS3 / Sass', category: 'Languages' },
              { id: 'sk-5', name: 'React.js', category: 'Frameworks & Libraries' },
              { id: 'sk-6', name: 'Next.js', category: 'Frameworks & Libraries' },
              { id: 'sk-7', name: 'Angular (standalone)', category: 'Frameworks & Libraries' },
              { id: 'sk-8', name: 'RxJS', category: 'Frameworks & Libraries' },
              { id: 'sk-9', name: 'Redux Toolkit', category: 'Frameworks & Libraries' },
              { id: 'sk-10', name: 'TanStack Query', category: 'Frameworks & Libraries' },
              { id: 'sk-11', name: 'Tailwind CSS', category: 'Styling & UI' },
              { id: 'sk-12', name: 'Bootstrap', category: 'Styling & UI' },
              { id: 'sk-13', name: 'shadcn/ui', category: 'Styling & UI' },
              { id: 'sk-14', name: 'Aceternity UI', category: 'Styling & UI' },
              { id: 'sk-15', name: 'Responsive Design', category: 'Styling & UI' },
              { id: 'sk-16', name: 'REST APIs', category: 'APIs & Integrations' },
              { id: 'sk-17', name: 'GraphQL / Apollo', category: 'APIs & Integrations' },
              { id: 'sk-18', name: 'OpenAI API', category: 'APIs & Integrations' },
              { id: 'sk-19', name: 'bKash / SSLCommerz', category: 'APIs & Integrations' },
              { id: 'sk-20', name: 'Git & GitHub', category: 'Tools & Platforms' },
              { id: 'sk-21', name: 'Postman', category: 'Tools & Platforms' },
              { id: 'sk-22', name: 'Chrome DevTools', category: 'Tools & Platforms' },
              { id: 'sk-23', name: 'Vercel / Netlify', category: 'Tools & Platforms' },
              { id: 'sk-24', name: 'Node.js / Express.js', category: 'Backend Familiarity' },
              { id: 'sk-25', name: 'MySQL / MongoDB', category: 'Backend Familiarity' },
              { id: 'sk-26', name: 'ASP.NET Core Web API', category: 'Backend Familiarity' },
              { id: 'sk-27', name: 'Agile / Scrum', category: 'Practices' },
              { id: 'sk-28', name: 'Reusable Components', category: 'Practices' },
              { id: 'sk-29', name: 'Code Review', category: 'Practices' },
            ],
            projects: [
              {
                id: 'proj-1',
                title: 'CareerCraft',
                technologies: 'Next.js 14, NestJS, TypeScript, MySQL, Prisma ORM, Tailwind CSS',
                description:
                  '• Full-stack CV Builder & Portfolio Platform.\n• Build professional CVs using beautiful templates with browser-native A4 PDF export.\n• Publish a personal portfolio site with a unique public URL.\n• Import an existing CV by uploading a PDF or DOCX file (auto-parsed).\n• Dark/light themes and custom typography.',
                url: 'https://career-craft.vercel.app',
                github: 'https://github.com/raselcsedev/career-craft',
              },
              {
                id: 'proj-2',
                title: 'AI Content Studio',
                technologies: 'Next.js, TypeScript, MongoDB, OpenAI API, NextAuth, Tailwind CSS',
                description:
                  '• Built an AI content generation platform for blog posts, emails, code snippets, and image prompts.\n• Implemented authentication, user management, and role-based access control.\n• Responsive dashboard with usage analytics and searchable history.',
                github: 'https://github.com/raselcsedev/ai-content-studio',
              },
              {
                id: 'proj-3',
                title: 'RetailPOS',
                technologies: 'Next.js, TypeScript, MongoDB, Mongoose, NextAuth',
                description:
                  '• Developed a full-stack point-of-sale and inventory management application with barcode generation, tracking, and sales processing.\n• Built dashboard analytics, thermal receipt printing, and PWA support.',
                github: 'https://github.com/raselcsedev/retail-pos',
                url: 'https://jovial-sable-2db9bd.netlify.app/',
              },
            ],
            languages: [
              { id: 'lang-1', name: 'Bangla', proficiency: 'Native' },
              { id: 'lang-2', name: 'English', proficiency: 'Full working proficiency' },
            ],
            certifications: [],
          },
          styling: {
            primaryColor: '#334155',
            fontFamily: 'Inter',
            fontSize: 'normal',
            spacing: 'normal',
          },
        },
      });
      console.log('✅ Seeded Sample CV (Executive Banner)');
    }
  }

  // 5. Seed Sample Portfolio with Developer Showcase template
  const portfolioTemplate = await prisma.portfolioTemplate.findUnique({
    where: { slug: 'developer-showcase' },
  });

  if (portfolioTemplate) {
    const existingPortfolio = await prisma.portfolio.findUnique({
      where: { slug: 'rasel' },
    });

    if (!existingPortfolio) {
      await prisma.portfolio.create({
        data: {
          userId: demoUser.id,
          templateId: portfolioTemplate.id,
          title: 'Md. Rasel Aktar — Developer Portfolio',
          slug: 'rasel',
          bio: 'Frontend Developer with 4 years of experience building high-performance web applications, enterprise ERPs, and modern SaaS products.',
          themeConfig: {
            primaryColor: '#06b6d4',
            fontFamily: 'Inter',
            darkMode: true,
          },
          isPublished: true,
          publishedAt: new Date(),
          projects: {
            create: [
              {
                title: 'CareerCraft',
                description:
                  'Full-stack CV Builder & Portfolio Platform. Build CVs, export A4 PDFs, import documents, and publish personal portfolio sites with role-based auth.',
                technologies: ['Next.js 14', 'NestJS', 'TypeScript', 'MySQL', 'Prisma', 'Tailwind CSS'],
                projectUrl: 'https://career-craft.vercel.app',
                repoUrl: 'https://github.com/raselcsedev/career-craft',
                isFeatured: true,
                displayOrder: 0,
              },
              {
                title: 'Product Manager',
                description:
                  'Full-stack product CRUD app with Next.js frontend and ASP.NET Core Web API on SQL Server with EF Core migrations and Docker.',
                technologies: ['Next.js', 'ASP.NET Core', 'C#', 'SQL Server', 'Docker'],
                repoUrl: 'https://github.com/raselcsedev/product-manager',
                isFeatured: true,
                displayOrder: 1,
              },
              {
                title: 'AI Content Studio',
                description:
                  'AI SaaS platform that generates blog posts, emails, code snippets, and image prompts with usage analytics and dark/light themes.',
                technologies: ['Next.js', 'TypeScript', 'MongoDB', 'OpenAI API', 'NextAuth'],
                repoUrl: 'https://github.com/raselcsedev/ai-content-studio',
                isFeatured: false,
                displayOrder: 2,
              },
              {
                title: 'RetailPOS',
                description:
                  'Point-of-sale and inventory system with barcode generation and scanning, thermal receipt printing, role-based access, and PWA.',
                technologies: ['Next.js', 'TypeScript', 'MongoDB', 'Mongoose', 'Tailwind CSS'],
                projectUrl: 'https://jovial-sable-2db9bd.netlify.app/',
                repoUrl: 'https://github.com/raselcsedev/retail-pos',
                isFeatured: false,
                displayOrder: 3,
              },
            ],
          },
        },
      });
      console.log('✅ Seeded Sample Portfolio (Developer Showcase)');
    }
  }

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
