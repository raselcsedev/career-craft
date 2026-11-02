/*
 * UsersController — Profile & Account Management
 */
import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  UseGuards,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
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

  @Patch('me/password')
  @ApiOperation({ summary: 'Change current user password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 400, description: 'Current password invalid' })
  async changePassword(
    @CurrentUser() user: any,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(user.id, dto);
  }

  @Delete('me')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Permanently delete user account and all documents' })
  @ApiResponse({ status: 200, description: 'Account deleted' })
  async deleteAccount(
    @CurrentUser() user: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.usersService.deleteAccount(user.id);
    // Clear auth cookie
    res.clearCookie('access_token', { path: '/' });
    return result;
  }
}
