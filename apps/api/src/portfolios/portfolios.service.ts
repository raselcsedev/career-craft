/*
 * PortfoliosService — Business Logic, Slug Reservation, and Publishing Rules
 *
 * 🔑 NestJS Security Principle: Public Minimization & Slug Safety
 * 1. Reserved words like 'api', 'admin', 'login' are rejected immediately.
 * 2. `findBySlugPublic` ONLY returns records where `isPublished === true`.
 * 3. Sensitive user credentials (`passwordHash`) are stripped before public delivery.
 */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';

const RESERVED_SLUGS = new Set([
  'api',
  'admin',
  'dashboard',
  'login',
  'register',
  'auth',
  'p',
  'portfolio',
  'portfolios',
  'cv',
  'cvs',
  'docs',
  'settings',
  'profile',
  'public',
  'health',
  'static',
]);

@Injectable()
export class PortfoliosService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  private validateSlug(slug: string) {
    const cleanSlug = slug.toLowerCase().trim();
    if (RESERVED_SLUGS.has(cleanSlug)) {
      throw new BadRequestException(`The slug '${cleanSlug}' is a reserved keyword and cannot be used.`);
    }
    return cleanSlug;
  }

  private async resolveTemplateId(templateIdOrSlug: string): Promise<string> {
    const template = await this.prisma.portfolioTemplate.findFirst({
      where: {
        OR: [{ id: templateIdOrSlug }, { slug: templateIdOrSlug }],
        isActive: true,
      },
    });

    if (!template) {
      throw new BadRequestException(`Portfolio template '${templateIdOrSlug}' does not exist or is inactive.`);
    }

    return template.id;
  }

  async findAll(userId: string) {
    return this.prisma.portfolio.findMany({
      where: { userId },
      include: {
        template: true,
        _count: {
          select: { projects: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const portfolio = await this.prisma.portfolio.findFirst({
      where: { id, userId },
      include: {
        template: true,
        projects: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });

    if (!portfolio) {
      throw new NotFoundException('Portfolio not found or access denied');
    }

    return portfolio;
  }

  async findBySlugPublic(slug: string) {
    const cleanSlug = slug.toLowerCase().trim();

    const portfolio = await this.prisma.portfolio.findUnique({
      where: { slug: cleanSlug },
      include: {
        template: true,
        projects: {
          orderBy: { displayOrder: 'asc' },
        },
        user: {
          select: {
            profile: true,
          },
        },
      },
    });

    // Enforce: Unpublished portfolios MUST NEVER be returned to the public
    if (!portfolio || !portfolio.isPublished) {
      throw new NotFoundException('Portfolio not found or has not been published yet');
    }

    // Sanitize response
    return {
      id: portfolio.id,
      title: portfolio.title,
      slug: portfolio.slug,
      bio: portfolio.bio,
      themeConfig: portfolio.themeConfig,
      publishedAt: portfolio.publishedAt,
      template: portfolio.template,
      projects: portfolio.projects,
      owner: portfolio.user.profile,
    };
  }

  async create(userId: string, dto: CreatePortfolioDto) {
    const slug = this.validateSlug(dto.slug);

    // Check slug collision
    const existing = await this.prisma.portfolio.findUnique({
      where: { slug },
    });
    if (existing) {
      throw new ConflictException(`The portfolio slug '${slug}' is already in use. Please choose another.`);
    }

    const templateId = await this.resolveTemplateId(dto.templateId);
    const profile = await this.usersService.getProfile(userId);

    const initialThemeConfig = dto.themeConfig || {
      primaryColor: '#4f46e5',
      fontFamily: 'Inter',
      darkMode: false,
      sections: {
        about: true,
        skills: true,
        projects: true,
        contact: true,
      },
    };

    const initialBio = dto.bio || profile?.bio || profile?.headline || 'Passionate professional building modern applications.';

    return this.prisma.portfolio.create({
      data: {
        userId,
        templateId,
        title: dto.title,
        slug,
        bio: initialBio,
        themeConfig: initialThemeConfig,
        isPublished: false,
      },
      include: {
        template: true,
        projects: true,
      },
    });
  }

  async update(userId: string, id: string, dto: UpdatePortfolioDto) {
    const existing = await this.findOne(userId, id);

    let slug = existing.slug;
    if (dto.slug && dto.slug.toLowerCase().trim() !== existing.slug) {
      slug = this.validateSlug(dto.slug);
      const duplicate = await this.prisma.portfolio.findUnique({
        where: { slug },
      });
      if (duplicate && duplicate.id !== id) {
        throw new ConflictException(`The slug '${slug}' is already taken.`);
      }
    }

    let templateId: string | undefined;
    if (dto.templateId) {
      templateId = await this.resolveTemplateId(dto.templateId);
    }

    return this.prisma.portfolio.update({
      where: { id },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.slug && { slug }),
        ...(templateId && { templateId }),
        ...(dto.bio !== undefined && { bio: dto.bio }),
        ...(dto.themeConfig && { themeConfig: dto.themeConfig }),
        ...(dto.isPublished !== undefined && {
          isPublished: dto.isPublished,
          publishedAt: dto.isPublished ? new Date() : null,
        }),
      },
      include: {
        template: true,
        projects: true,
      },
    });
  }

  async publish(userId: string, id: string) {
    await this.findOne(userId, id);

    return this.prisma.portfolio.update({
      where: { id },
      data: {
        isPublished: true,
        publishedAt: new Date(),
      },
      include: { template: true },
    });
  }

  async unpublish(userId: string, id: string) {
    await this.findOne(userId, id);

    return this.prisma.portfolio.update({
      where: { id },
      data: {
        isPublished: false,
      },
      include: { template: true },
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);

    await this.prisma.portfolio.delete({
      where: { id },
    });

    return { message: 'Portfolio deleted successfully' };
  }

  // --- Project CRUD ---

  async addProject(userId: string, portfolioId: string, dto: CreateProjectDto) {
    await this.findOne(userId, portfolioId);

    const count = await this.prisma.portfolioProject.count({
      where: { portfolioId },
    });

    return this.prisma.portfolioProject.create({
      data: {
        portfolioId,
        title: dto.title,
        description: dto.description,
        technologies: Array.isArray(dto.technologies)
          ? dto.technologies
          : String(dto.technologies).split(',').map((t) => t.trim()).filter(Boolean),
        projectUrl: dto.projectUrl,
        repoUrl: dto.repoUrl,
        imageUrl: dto.imageUrl,
        displayOrder: dto.displayOrder ?? count,
        isFeatured: dto.isFeatured ?? false,
      },
    });
  }

  async updateProject(
    userId: string,
    portfolioId: string,
    projectId: string,
    dto: UpdateProjectDto,
  ) {
    await this.findOne(userId, portfolioId);

    const project = await this.prisma.portfolioProject.findFirst({
      where: { id: projectId, portfolioId },
    });
    if (!project) {
      throw new NotFoundException('Project not found in this portfolio');
    }

    return this.prisma.portfolioProject.update({
      where: { id: projectId },
      data: {
        ...(dto.title && { title: dto.title }),
        ...(dto.description && { description: dto.description }),
        ...(dto.technologies && {
          technologies: Array.isArray(dto.technologies)
            ? dto.technologies
            : String(dto.technologies).split(',').map((t) => t.trim()).filter(Boolean),
        }),
        ...(dto.projectUrl !== undefined && { projectUrl: dto.projectUrl }),
        ...(dto.repoUrl !== undefined && { repoUrl: dto.repoUrl }),
        ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
        ...(dto.displayOrder !== undefined && { displayOrder: dto.displayOrder }),
        ...(dto.isFeatured !== undefined && { isFeatured: dto.isFeatured }),
      },
    });
  }

  async removeProject(userId: string, portfolioId: string, projectId: string) {
    await this.findOne(userId, portfolioId);

    const project = await this.prisma.portfolioProject.findFirst({
      where: { id: projectId, portfolioId },
    });
    if (!project) {
      throw new NotFoundException('Project not found');
    }

    await this.prisma.portfolioProject.delete({
      where: { id: projectId },
    });

    return { message: 'Project removed successfully' };
  }
}
