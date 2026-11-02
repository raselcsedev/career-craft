import { IsBoolean, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePortfolioDto {
  @ApiPropertyOptional({ example: 'Alex Morgan — Senior Engineer Portfolio' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  title?: string;

  @ApiPropertyOptional({ example: 'alex-morgan-dev' })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must contain only lowercase letters, numbers, and single hyphens',
  })
  slug?: string;

  @ApiPropertyOptional({ example: 'dark-creative' })
  @IsOptional()
  @IsString()
  templateId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional()
  @IsOptional()
  themeConfig?: Record<string, any>;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
