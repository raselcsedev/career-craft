/*
 * RegisterDto — Validation schema for registration requests
 *
 * 🔑 NestJS Concept: DTO (Data Transfer Object) & class-validator
 * This acts just like a Zod schema in Next.js:
 *   z.object({ email: z.string().email(), password: z.string().min(6) })
 *
 * The decorators validate the JSON body automatically before the controller receives it!
 */
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: 'User valid email address' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @ApiProperty({ example: 'Password123!', description: 'User password (min 6 chars)' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password!: string;

  @ApiPropertyOptional({ example: 'Alex', description: 'User first name' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ example: 'Morgan', description: 'User last name' })
  @IsOptional()
  @IsString()
  lastName?: string;
}
