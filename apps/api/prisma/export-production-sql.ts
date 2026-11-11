import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

function sqlEscape(val: any): string {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'boolean') return val ? '1' : '0';
  if (typeof val === 'number') return String(val);
  if (typeof val === 'object') {
    return "'" + JSON.stringify(val).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
  }
  return "'" + String(val).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
}

async function exportSql() {
  const users = await prisma.user.findMany({ include: { profile: true } });
  const cvTemplates = await prisma.cvTemplate.findMany();
  const portfolioTemplates = await prisma.portfolioTemplate.findMany();
  const cvs = await prisma.cv.findMany();
  const portfolios = await prisma.portfolio.findMany({ include: { projects: true } });

  const out: string[] = [];
  out.push('-- ==============================================================');
  out.push('-- CareerCraft Production Seed SQL');
  out.push('-- Generated from Local Database');
  out.push('-- Includes: Templates, Demo User, Md. Rasel Aktar CV and Portfolio');
  out.push('-- ==============================================================\n');
  out.push('SET FOREIGN_KEY_CHECKS = 0;\n');

  // 1. CV Templates
  out.push('-- 1. CV Templates');
  for (const t of cvTemplates) {
    out.push(
      `INSERT INTO \`cv_templates\` (\`id\`, \`slug\`, \`name\`, \`description\`, \`thumbnail\`, \`layout\`, \`isActive\`, \`createdAt\`, \`updatedAt\`) ` +
      `VALUES (${sqlEscape(t.id)}, ${sqlEscape(t.slug)}, ${sqlEscape(t.name)}, ${sqlEscape(t.description)}, ${sqlEscape(t.thumbnail)}, ${sqlEscape(t.layout)}, ${sqlEscape(t.isActive)}, NOW(), NOW()) ` +
      `ON DUPLICATE KEY UPDATE \`name\`=VALUES(\`name\`), \`layout\`=VALUES(\`layout\`), \`description\`=VALUES(\`description\`), \`thumbnail\`=VALUES(\`thumbnail\`);`
    );
  }
  out.push('');

  // 2. Portfolio Templates
  out.push('-- 2. Portfolio Templates');
  for (const t of portfolioTemplates) {
    out.push(
      `INSERT INTO \`portfolio_templates\` (\`id\`, \`slug\`, \`name\`, \`description\`, \`thumbnail\`, \`layout\`, \`isActive\`, \`createdAt\`, \`updatedAt\`) ` +
      `VALUES (${sqlEscape(t.id)}, ${sqlEscape(t.slug)}, ${sqlEscape(t.name)}, ${sqlEscape(t.description)}, ${sqlEscape(t.thumbnail)}, ${sqlEscape(t.layout)}, ${sqlEscape(t.isActive)}, NOW(), NOW()) ` +
      `ON DUPLICATE KEY UPDATE \`name\`=VALUES(\`name\`), \`layout\`=VALUES(\`layout\`), \`description\`=VALUES(\`description\`), \`thumbnail\`=VALUES(\`thumbnail\`);`
    );
  }
  out.push('');

  // 3. Users and Profiles
  out.push('-- 3. Users and Profiles');
  for (const u of users) {
    out.push(
      `INSERT INTO \`users\` (\`id\`, \`email\`, \`passwordHash\`, \`role\`, \`createdAt\`, \`updatedAt\`) ` +
      `VALUES (${sqlEscape(u.id)}, ${sqlEscape(u.email)}, ${sqlEscape(u.passwordHash)}, ${sqlEscape(u.role)}, NOW(), NOW()) ` +
      `ON DUPLICATE KEY UPDATE \`role\`=VALUES(\`role\`);`
    );
    if (u.profile) {
      const p = u.profile;
      out.push(
        `INSERT INTO \`profiles\` (\`id\`, \`userId\`, \`firstName\`, \`lastName\`, \`headline\`, \`bio\`, \`avatarUrl\`, \`phone\`, \`address\`, \`city\`, \`country\`, \`postalCode\`, \`website\`, \`github\`, \`linkedin\`, \`twitter\`, \`createdAt\`, \`updatedAt\`) ` +
        `VALUES (${sqlEscape(p.id)}, ${sqlEscape(p.userId)}, ${sqlEscape(p.firstName)}, ${sqlEscape(p.lastName)}, ${sqlEscape(p.headline)}, ${sqlEscape(p.bio)}, ${sqlEscape(p.avatarUrl)}, ${sqlEscape(p.phone)}, ${sqlEscape(p.address)}, ${sqlEscape(p.city)}, ${sqlEscape(p.country)}, ${sqlEscape(p.postalCode)}, ${sqlEscape(p.website)}, ${sqlEscape(p.github)}, ${sqlEscape(p.linkedin)}, ${sqlEscape(p.twitter)}, NOW(), NOW()) ` +
        `ON DUPLICATE KEY UPDATE \`headline\`=VALUES(\`headline\`), \`bio\`=VALUES(\`bio\`);`
      );
    }
  }
  out.push('');

  // 4. CV Documents
  out.push('-- 4. CV Documents');
  for (const c of cvs) {
    out.push(
      `INSERT INTO \`cvs\` (\`id\`, \`userId\`, \`templateId\`, \`title\`, \`slug\`, \`content\`, \`styling\`, \`createdAt\`, \`updatedAt\`) ` +
      `VALUES (${sqlEscape(c.id)}, ${sqlEscape(c.userId)}, ${sqlEscape(c.templateId)}, ${sqlEscape(c.title)}, ${sqlEscape(c.slug)}, ${sqlEscape(c.content)}, ${sqlEscape(c.styling)}, NOW(), NOW()) ` +
      `ON DUPLICATE KEY UPDATE \`title\`=VALUES(\`title\`), \`content\`=VALUES(\`content\`), \`styling\`=VALUES(\`styling\`);`
    );
  }
  out.push('');

  // 5. Portfolios & Projects
  out.push('-- 5. Portfolios and Projects');
  for (const p of portfolios) {
    out.push(
      `INSERT INTO \`portfolios\` (\`id\`, \`userId\`, \`templateId\`, \`title\`, \`slug\`, \`bio\`, \`themeConfig\`, \`isPublished\`, \`publishedAt\`, \`createdAt\`, \`updatedAt\`) ` +
      `VALUES (${sqlEscape(p.id)}, ${sqlEscape(p.userId)}, ${sqlEscape(p.templateId)}, ${sqlEscape(p.title)}, ${sqlEscape(p.slug)}, ${sqlEscape(p.bio)}, ${sqlEscape(p.themeConfig)}, ${sqlEscape(p.isPublished)}, NOW(), NOW(), NOW()) ` +
      `ON DUPLICATE KEY UPDATE \`title\`=VALUES(\`title\`), \`slug\`=VALUES(\`slug\`), \`bio\`=VALUES(\`bio\`), \`isPublished\`=VALUES(\`isPublished\`);`
    );
    for (const proj of p.projects || []) {
      out.push(
        `INSERT INTO \`portfolio_projects\` (\`id\`, \`portfolioId\`, \`title\`, \`description\`, \`technologies\`, \`projectUrl\`, \`repoUrl\`, \`imageUrl\`, \`displayOrder\`, \`isFeatured\`, \`createdAt\`, \`updatedAt\`) ` +
        `VALUES (${sqlEscape(proj.id)}, ${sqlEscape(proj.portfolioId)}, ${sqlEscape(proj.title)}, ${sqlEscape(proj.description)}, ${sqlEscape(proj.technologies)}, ${sqlEscape(proj.projectUrl)}, ${sqlEscape(proj.repoUrl)}, ${sqlEscape(proj.imageUrl)}, ${sqlEscape(proj.displayOrder)}, ${sqlEscape(proj.isFeatured)}, NOW(), NOW()) ` +
        `ON DUPLICATE KEY UPDATE \`title\`=VALUES(\`title\`), \`description\`=VALUES(\`description\`);`
      );
    }
  }
  out.push('');
  out.push('SET FOREIGN_KEY_CHECKS = 1;\n');

  const filePath = path.join(__dirname, 'production_seed.sql');
  fs.writeFileSync(filePath, out.join('\n'), 'utf8');
  console.log('SUCCESS: Exported production SQL to', filePath, 'Size:', fs.statSync(filePath).size, 'bytes');
}

exportSql()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
