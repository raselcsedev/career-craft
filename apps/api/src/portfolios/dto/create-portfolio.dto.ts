import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePortfolioDto {
  @ApiProperty({ example: 'Alex Morgan — Senior Developer' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title!: string;

  @ApiProperty({ example: 'alex-morgan', description: 'URL-safe public slug' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must contain only lowercase letters, numbers, and single hyphens (e.g. alex-morgan)',
  })
  slug!: string;

  @ApiProperty({ example: 'minimal-developer', description: 'Template slug or ID' })
  @IsString()
  @IsNotEmpty()
  templateId!: string;

  @ApiPropertyOptional({ example: 'Full-stack software engineer building reliable cloud apps.' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ description: 'Theme configuration (colors, font, section order)' })
  @IsOptional()
  themeConfig?: Record<string, any>;
}
