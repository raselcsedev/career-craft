/*
 * CvsController — CV Endpoints
 *
 * 🔑 NestJS Concept: Route Parameters & Ownership Guards
 * `@Param('id') id: string`: Extracts the :id from the URL path.
 * `@CurrentUser() user`: Extracts the authenticated user from the JWT.
 * Every method pairs these two parameters to enforce ownership.
 */
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CvsService } from './cvs.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('CVs')
@Controller('cvs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CvsController {
  constructor(private cvsService: CvsService) {}

  @Get()
  @ApiOperation({ summary: "List all current user's CV documents" })
  @ApiResponse({ status: 200, description: 'CVs retrieved successfully' })
  async findAll(@CurrentUser() user: any) {
    const cvs = await this.cvsService.findAll(user.id);
    return { cvs };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new CV document' })
  @ApiResponse({ status: 201, description: 'CV created successfully' })
  async create(
    @CurrentUser() user: any,
    @Body() dto: CreateCvDto,
  ) {
    const cv = await this.cvsService.create(user.id, dto);
    return {
      message: 'CV created successfully',
      cv,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific CV document by ID' })
  @ApiResponse({ status: 200, description: 'CV retrieved successfully' })
  @ApiResponse({ status: 404, description: 'CV not found or access denied' })
  async findOne(
    @CurrentUser() user: any,
    @Param('id') id: string,
  ) {
    const cv = await this.cvsService.findOne(user.id, id);
    return { cv };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update CV title, template, or content' })
  @ApiResponse({ status: 200, description: 'CV updated successfully' })
  @ApiResponse({ status: 404, description: 'CV not found or access denied' })
  async update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdateCvDto,
  ) {
    const cv = await this.cvsService.update(user.id, id, dto);
    return {
      message: 'CV updated successfully',
      cv,
    };
  }

  @Post(':id/duplicate')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Duplicate an existing CV document' })
  @ApiResponse({ status: 201, description: 'CV duplicated successfully' })
  async duplicate(
    @CurrentUser() user: any,
    @Param('id') id: string,
  ) {
    const cv = await this.cvsService.duplicate(user.id, id);
    return {
      message: 'CV duplicated successfully',
      cv,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a CV document' })
  @ApiResponse({ status: 200, description: 'CV deleted successfully' })
  @ApiResponse({ status: 404, description: 'CV not found or access denied' })
  async remove(
    @CurrentUser() user: any,
    @Param('id') id: string,
  ) {
    return this.cvsService.remove(user.id, id);
  }
}
