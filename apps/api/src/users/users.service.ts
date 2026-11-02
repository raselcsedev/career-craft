/*
 * UsersService — User and Profile Query Service
 *
 * 🔑 NestJS Concept: Dependency Injection (DI)
 * Look at the constructor:
 *   constructor(private prisma: PrismaService) {}
 *
 * We don't do `new PrismaService()`. NestJS automatically injects the single
 * PrismaService instance when UsersService is initialized!
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

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
      // Auto-create blank profile if not present
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
}
