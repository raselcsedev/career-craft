import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Portfolio Templates')
@Controller('portfolio-templates')
export class PortfolioTemplatesController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'List all available portfolio templates' })
  @ApiResponse({ status: 200, description: 'Templates retrieved successfully' })
  async findAll() {
    const templates = await this.prisma.portfolioTemplate.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
    });
    return { templates };
  }
}
