import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCvDto {
  @ApiProperty({ example: 'Full-Stack Developer Resume', description: 'CV document title' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title!: string;

  @ApiProperty({ example: 'classic-professional', description: 'Template ID or Template Slug' })
  @IsString()
  @IsNotEmpty()
  templateId!: string;

  @ApiPropertyOptional({ description: 'Structured CV content (JSON)' })
  @IsOptional()
  content?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Custom styling preferences (colors, fonts, order)' })
  @IsOptional()
  styling?: Record<string, any>;
}
