/*
 * AdminService — System Statistics & Template Administration
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getSystemStats() {
    const [userCount, cvCount, portfolioCount, cvTemplateCount, portfolioTemplateCount] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.cv.count(),
        this.prisma.portfolio.count(),
        this.prisma.cvTemplate.count(),
        this.prisma.portfolioTemplate.count(),
      ]);

    return {
      users: userCount,
      cvs: cvCount,
      portfolios: portfolioCount,
      cvTemplates: cvTemplateCount,
      portfolioTemplates: portfolioTemplateCount,
    };
  }

  async getAllTemplates() {
    const [cvTemplates, portfolioTemplates] = await Promise.all([
      this.prisma.cvTemplate.findMany({ orderBy: { createdAt: 'asc' } }),
      this.prisma.portfolioTemplate.findMany({ orderBy: { createdAt: 'asc' } }),
    ]);

    return {
      cvTemplates,
      portfolioTemplates,
    };
  }

  async updateCvTemplateStatus(id: string, isActive: boolean) {
    const template = await this.prisma.cvTemplate.findUnique({ where: { id } });
    if (!template) {
      throw new NotFoundException('CV template not found');
    }

    return this.prisma.cvTemplate.update({
      where: { id },
      data: { isActive },
    });
  }

  async updatePortfolioTemplateStatus(id: string, isActive: boolean) {
    const template = await this.prisma.portfolioTemplate.findUnique({ where: { id } });
    if (!template) {
      throw new NotFoundException('Portfolio template not found');
    }

    return this.prisma.portfolioTemplate.update({
      where: { id },
      data: { isActive },
    });
  }
}
