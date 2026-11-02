import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ example: 'CurrentPassword123!' })
  @IsString()
  @IsNotEmpty({ message: 'Current password is required' })
  currentPassword!: string;

  @ApiProperty({ example: 'NewSecretPassword456!' })
  @IsString()
  @MinLength(6, { message: 'New password must be at least 6 characters long' })
  newPassword!: string;
}
