/*
 * UsersService — User and Profile Query Service
 */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { profile: true },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });
  }

  async create(data: { email: string; passwordHash: string; firstName?: string; lastName?: string }) {
    return this.prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash: data.passwordHash,
        profile: {
          create: {
            firstName: data.firstName || '',
            lastName: data.lastName || '',
          },
        },
      },
      include: { profile: true },
    });
  }

  async getProfile(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
    });
    if (!profile) {
      return this.prisma.profile.create({
        data: { userId },
      });
    }
    return profile;
  }

  async updateProfile(userId: string, data: UpdateProfileDto) {
    return this.prisma.profile.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        ...data,
      },
    });
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const matches = await bcrypt.compare(dto.currentPassword, user.passwordHash);
    if (!matches) {
      throw new BadRequestException('Current password does not match our records');
    }

    const newHash = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    return { message: 'Password updated successfully' };
  }

  async deleteAccount(userId: string) {
    await this.prisma.user.delete({
      where: { id: userId },
    });
    return { message: 'Your account and all associated data have been permanently deleted.' };
  }
}
