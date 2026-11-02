/*
 * PublicPortfoliosController — Public-Facing Portfolio Endpoint
 *
 * 🔑 NestJS Security: No AuthGuard, Strict Data Minimization
 * This controller has NO @UseGuards(JwtAuthGuard). It can be viewed by anyone on the internet.
 * It calls `findBySlugPublic` which checks `isPublished === true` and omits private data.
 */
import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PortfoliosService } from './portfolios.service';

@ApiTags('Public Portfolios')
@Controller('public/portfolios')
export class PublicPortfoliosController {
  constructor(private portfoliosService: PortfoliosService) {}

  @Get(':slug')
  @ApiOperation({ summary: 'View a published portfolio website by unique slug' })
  @ApiResponse({ status: 200, description: 'Portfolio retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Portfolio not found or is private' })
  async getBySlug(@Param('slug') slug: string) {
    const portfolio = await this.portfoliosService.findBySlugPublic(slug);
    return { portfolio };
  }
}
