/*
 * CvsService — CV Business Logic & Ownership Enforcement
 *
 * 🔑 NestJS Security Principle: Ownership Enforcement
 * Notice that EVERY method takes `userId: string` as its first parameter.
 * We never query `prisma.cv.findUnique({ where: { id } })` without verifying that
 * `cv.userId === userId`. This guarantees users cannot read, edit, duplicate, or delete
 * another user's CV simply by changing the ID in the URL.
 */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';

@Injectable()
export class CvsService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  private async resolveTemplateId(templateIdOrSlug: string): Promise<string> {
    const template = await this.prisma.cvTemplate.findFirst({
      where: {
        OR: [{ id: templateIdOrSlug }, { slug: templateIdOrSlug }],
        isActive: true,
      },
    });

    if (!template) {
      throw new BadRequestException(`CV template '${templateIdOrSlug}' does not exist or is inactive`);
    }

    return template.id;
  }

  async findAll(userId: string) {
    return this.prisma.cv.findMany({
      where: { userId },
      include: {
        template: {
          select: {
            id: true,
            slug: true,
            name: true,
            layout: true,
            thumbnail: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const cv = await this.prisma.cv.findFirst({
      where: { id, userId },
      include: { template: true },
    });

    if (!cv) {
      throw new NotFoundException('CV document not found or access denied');
    }

    return cv;
  }

  async create(userId: string, dto: CreateCvDto) {
    const templateId = await this.resolveTemplateId(dto.templateId);

    // If no content was supplied, auto-seed with user's reusable profile
    let initialContent = dto.content;
    if (!initialContent || Object.keys(initialContent).length === 0) {
      const profile = await this.usersService.getProfile(userId);
      const user = await this.usersService.findById(userId);

      initialContent = {
        personalInfo: {
          fullName: `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim() || 'My Full Name',
          headline: profile?.headline || 'Professional Title',
          email: user?.email || '',
          phone: profile?.phone || '',
          city: profile?.city || '',
          country: profile?.country || '',
          website: profile?.website || '',
          github: profile?.github || '',
          linkedin: profile?.linkedin || '',
        },
        summary: profile?.bio || 'Dedicated professional with a proven track record of delivering impactful results.',
        experiences: [
          {
            id: 'exp-1',
            company: 'Acme Corporation',
            position: 'Senior Specialist',
            location: 'San Francisco, CA',
            startDate: '2022-01',
            endDate: '',
            current: true,
            description: 'Led core product development initiatives, improved performance by 35%, and mentored team members.',
          },
        ],
        educations: [
          {
            id: 'edu-1',
            institution: 'State University',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            startDate: '2016-09',
            endDate: '2020-05',
            grade: '3.8 GPA',
          },
        ],
        skills: [
          { id: 'sk-1', name: 'TypeScript', category: 'Technical' },
          { id: 'sk-2', name: 'React / Next.js', category: 'Technical' },
          { id: 'sk-3', name: 'Node.js / NestJS', category: 'Technical' },
          { id: 'sk-4', name: 'MySQL & Databases', category: 'Technical' },
          { id: 'sk-5', name: 'Team Leadership', category: 'Soft' },
        ],
        projects: [
          {
            id: 'proj-1',
            title: 'High-Scale Analytics Platform',
            description: 'Engineered real-time telemetry pipeline processing over 1M events daily with automated reporting.',
            technologies: 'React, NestJS, MySQL, Docker',
            url: 'https://github.com',
          },
        ],
        certifications: [
          {
            id: 'cert-1',
            name: 'Certified Cloud Practitioner',
            issuer: 'Amazon Web Services',
            date: '2023',
          },
        ],
        languages: [
          { id: 'lang-1', name: 'English', proficiency: 'Native / Fluent' },
        ],
      };
    }

    const initialStyling = dto.styling || {
      primaryColor: '#4f46e5', // indigo-600
      fontFamily: 'Inter',
      fontSize: 'normal',
      spacing: 'normal',
      sectionOrder: ['personalInfo', 'summary', 'experiences', 'educations', 'skills', 'projects', 'certifications', 'languages'],
    };

    return this.prisma.cv.create({
      data: {
        userId,
        templateId,
        title: dto.title,
        content: initialContent,
        styling: initialStyling,
      },
      include: { template: true },
    });
  }

  async update(userId: string, id: string, dto: UpdateCvDto) {
    // 1. Enforce ownership check
    await this.findOne(userId, id);

    let templateId: string | undefined;
    if (dto.templateId) {
      templateId = await this.resolveTemplateId(dto.templateId);
    }

    return this.prisma.cv.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(templateId && { templateId }),
        ...(dto.content && { content: dto.content }),
        ...(dto.styling && { styling: dto.styling }),
      },
      include: { template: true },
    });
  }

  async duplicate(userId: string, id: string) {
    const original = await this.findOne(userId, id);

    return this.prisma.cv.create({
      data: {
        userId,
        templateId: original.templateId,
        title: `${original.title} (Copy)`,
        content: original.content as any,
        styling: original.styling as any,
      },
      include: { template: true },
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);

    await this.prisma.cv.delete({
      where: { id },
    });

    return { message: 'CV document deleted successfully' };
  }
}
