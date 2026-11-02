import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCvDto {
  @ApiPropertyOptional({ example: 'Senior React Developer Resume' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  title?: string;

  @ApiPropertyOptional({ example: 'modern-corporate' })
  @IsOptional()
  @IsString()
  templateId?: string;

  @ApiPropertyOptional({ description: 'Structured CV content (JSON)' })
  @IsOptional()
  content?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Custom styling preferences' })
  @IsOptional()
  styling?: Record<string, any>;
}
