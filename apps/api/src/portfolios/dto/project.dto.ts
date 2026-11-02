import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 'Real-time Collaboration Platform' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title!: string;

  @ApiProperty({ example: 'Built distributed state sync engine with WebSocket fallback.' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ example: ['TypeScript', 'Next.js', 'NestJS', 'MySQL'] })
  @IsNotEmpty()
  technologies!: any;

  @ApiPropertyOptional({ example: 'https://demo.example.com' })
  @IsOptional()
  @IsString()
  projectUrl?: string;

  @ApiPropertyOptional({ example: 'https://github.com/username/project' })
  @IsOptional()
  @IsString()
  repoUrl?: string;

  @ApiPropertyOptional({ example: 'https://images.unsplash.com/...' })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  displayOrder?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}

export class UpdateProjectDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(150)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  technologies?: any;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  projectUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  repoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  displayOrder?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}
