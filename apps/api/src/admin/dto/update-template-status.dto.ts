import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTemplateStatusDto {
  @ApiProperty({ example: true, description: 'Template availability status' })
  @IsBoolean()
  isActive!: boolean;
}
