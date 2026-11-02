/*
 * AdminController — Restricted Administration Endpoints
 *
 * 🔑 NestJS Security: Multi-Guard Pipeline
 * `@UseGuards(JwtAuthGuard, RolesGuard)`
 * First, JwtAuthGuard verifies the JWT token.
 * Second, RolesGuard checks if `user.role === Role.ADMIN`.
 * If either fails, NestJS halts execution before reaching the route!
 */
import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { AdminService } from './admin.service';
import { UpdateTemplateStatusDto } from './dto/update-template-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get total platform usage statistics' })
  @ApiResponse({ status: 200, description: 'Stats retrieved' })
  @ApiResponse({ status: 403, description: 'Forbidden: Requires ADMIN role' })
  async getStats() {
    return this.adminService.getSystemStats();
  }

  @Get('templates')
  @ApiOperation({ summary: 'List all templates including inactive ones' })
  async getAllTemplates() {
    return this.adminService.getAllTemplates();
  }

  @Patch('cv-templates/:id')
  @ApiOperation({ summary: 'Toggle CV template availability' })
  async updateCvTemplate(
    @Param('id') id: string,
    @Body() dto: UpdateTemplateStatusDto,
  ) {
    const template = await this.adminService.updateCvTemplateStatus(id, dto.isActive);
    return {
      message: 'CV template status updated',
      template,
    };
  }

  @Patch('portfolio-templates/:id')
  @ApiOperation({ summary: 'Toggle Portfolio template availability' })
  async updatePortfolioTemplate(
    @Param('id') id: string,
    @Body() dto: UpdateTemplateStatusDto,
  ) {
    const template = await this.adminService.updatePortfolioTemplateStatus(id, dto.isActive);
    return {
      message: 'Portfolio template status updated',
      template,
    };
  }
}
