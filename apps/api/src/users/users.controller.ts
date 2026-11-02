/*
 * UsersController — Profile endpoints
 *
 * 🔑 NestJS Concept: PATCH & Partial Updates
 * In Next.js App Router, you'd handle PATCH in `app/api/users/me/profile/route.ts`.
 * Here, `@Patch('me/profile')` maps to PATCH /api/v1/users/me/profile.
 * `@UseGuards(JwtAuthGuard)` protects the route.
 * `@CurrentUser()` injects the authenticated user.
 */
import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me/profile')
  @ApiOperation({ summary: 'Retrieve current user profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  async getProfile(@CurrentUser() user: any) {
    const profile = await this.usersService.getProfile(user.id);
    return { profile };
  }

  @Patch('me/profile')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async updateProfile(
    @CurrentUser() user: any,
    @Body() dto: UpdateProfileDto,
  ) {
    const profile = await this.usersService.updateProfile(user.id, dto);
    return {
      message: 'Profile updated successfully',
      profile,
    };
  }
}
