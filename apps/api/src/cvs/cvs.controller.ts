/*
 * CvsController — CV Endpoints
 *
 * 🔑 NestJS Concept: Route Parameters & Ownership Guards
 * `@Param('id') id: string`: Extracts the :id from the URL path.
 * `@CurrentUser() user`: Extracts the authenticated user from the JWT.
 * Every method pairs these two parameters to enforce ownership.
 *
 * 🔑 NestJS Concept: File Upload with Multer
 * `@UseInterceptors(FileInterceptor('file'))` tells NestJS to parse the
 * incoming multipart/form-data request and place the file on `req.file`.
 * `@UploadedFile()` then injects that file object into the handler.
 * Multer stores the file in memory (MemoryStorage) so we get a Buffer we
 * can pass directly to our parser service — no temp-file cleanup needed.
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
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { CvsService } from './cvs.service';
import { CvParserService } from './cv-parser.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('CVs')
@Controller('cvs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CvsController {
  constructor(
    private cvsService: CvsService,
    private cvParserService: CvParserService,
  ) {}

  @Get()
  @ApiOperation({ summary: "List all current user's CV documents" })
  @ApiResponse({ status: 200, description: 'CVs retrieved successfully' })
  async findAll(@CurrentUser() user: any) {
    const cvs = await this.cvsService.findAll(user.id);
    return { cvs };
  }

  /**
   * POST /api/v1/cvs/parse-document
   *
   * Accepts a PDF or DOCX file and returns structured CV data.
   * The frontend uses this data to pre-populate the CV creation form.
   *
   * 🔑 NestJS Concept: FileInterceptor
   * `FileInterceptor('file')` wraps this route handler so that multipart
   * form-data is parsed before our method runs. The field name 'file'
   * must match the FormData key the frontend sends.
   * `memoryStorage()` tells Multer to keep the file in RAM (as a Buffer)
   * instead of writing it to disk — perfect for small documents.
   */
  @Post('parse-document')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
      fileFilter: (_req, file, callback) => {
        const allowed = [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        if (allowed.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(new BadRequestException('Only PDF and DOCX files are allowed'), false);
        }
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Parse a PDF or DOCX CV file and return extracted data' })
  @ApiResponse({ status: 200, description: 'Document parsed successfully' })
  async parseDocument(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded. Please attach a PDF or DOCX file.');
    }
    const extractedData = await this.cvParserService.parseDocument(file.buffer, file.mimetype);
    return {
      message: 'Document parsed successfully',
      fileName: file.originalname,
      fileSize: file.size,
      extractedData,
    };
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
