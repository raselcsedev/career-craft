/*
 * CvTemplatesController — CV Template Catalog Endpoints
 *
 * 🔑 NestJS Concept: Public vs Protected routes
 * This endpoint is public so visitors and authenticated users alike can browse templates.
 * We query Prisma to get all active templates sorted by creation date.
 */
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('CV Templates')
@Controller('cv-templates')
export class CvTemplatesController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'List all available active CV templates' })
  @ApiResponse({ status: 200, description: 'Templates retrieved successfully' })
  async findAll() {
    const templates = await this.prisma.cvTemplate.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
    });
    return { templates };
  }
}
