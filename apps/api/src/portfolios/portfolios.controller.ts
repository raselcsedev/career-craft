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
import { PortfoliosService } from './portfolios.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Portfolios')
@Controller('portfolios')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PortfoliosController {
  constructor(private portfoliosService: PortfoliosService) {}

  @Get()
  @ApiOperation({ summary: "List current user's portfolios" })
  async findAll(@CurrentUser() user: any) {
    const portfolios = await this.portfoliosService.findAll(user.id);
    return { portfolios };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new portfolio' })
  @ApiResponse({ status: 201, description: 'Portfolio created successfully' })
  async create(
    @CurrentUser() user: any,
    @Body() dto: CreatePortfolioDto,
  ) {
    const portfolio = await this.portfoliosService.create(user.id, dto);
    return {
      message: 'Portfolio created successfully',
      portfolio,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single portfolio with projects' })
  async findOne(
    @CurrentUser() user: any,
    @Param('id') id: string,
  ) {
    const portfolio = await this.portfoliosService.findOne(user.id, id);
    return { portfolio };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update portfolio details and theme' })
  async update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdatePortfolioDto,
  ) {
    const portfolio = await this.portfoliosService.update(user.id, id, dto);
    return {
      message: 'Portfolio updated successfully',
      portfolio,
    };
  }

  @Post(':id/publish')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Publish portfolio to make it publicly viewable' })
  async publish(
    @CurrentUser() user: any,
    @Param('id') id: string,
  ) {
    const portfolio = await this.portfoliosService.publish(user.id, id);
    return {
      message: 'Portfolio published successfully! It is now live.',
      portfolio,
    };
  }

  @Post(':id/unpublish')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Unpublish portfolio to make it private' })
  async unpublish(
    @CurrentUser() user: any,
    @Param('id') id: string,
  ) {
    const portfolio = await this.portfoliosService.unpublish(user.id, id);
    return {
      message: 'Portfolio unpublished. It is no longer publicly visible.',
      portfolio,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a portfolio' })
  async remove(
    @CurrentUser() user: any,
    @Param('id') id: string,
  ) {
    return this.portfoliosService.remove(user.id, id);
  }

  // --- Project Endpoints ---

  @Post(':id/projects')
  @ApiOperation({ summary: 'Add a project to this portfolio' })
  async addProject(
    @CurrentUser() user: any,
    @Param('id') portfolioId: string,
    @Body() dto: CreateProjectDto,
  ) {
    const project = await this.portfoliosService.addProject(user.id, portfolioId, dto);
    return {
      message: 'Project added successfully',
      project,
    };
  }

  @Patch(':id/projects/:projectId')
  @ApiOperation({ summary: 'Update a project in this portfolio' })
  async updateProject(
    @CurrentUser() user: any,
    @Param('id') portfolioId: string,
    @Param('projectId') projectId: string,
    @Body() dto: UpdateProjectDto,
  ) {
    const project = await this.portfoliosService.updateProject(user.id, portfolioId, projectId, dto);
    return {
      message: 'Project updated successfully',
      project,
    };
  }

  @Delete(':id/projects/:projectId')
  @ApiOperation({ summary: 'Remove a project from this portfolio' })
  async removeProject(
    @CurrentUser() user: any,
    @Param('id') portfolioId: string,
    @Param('projectId') projectId: string,
  ) {
    return this.portfoliosService.removeProject(user.id, portfolioId, projectId);
  }
}
