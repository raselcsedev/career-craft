/*
 * AppModule — The Root Module
 */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CvTemplatesModule } from './cv-templates/cv-templates.module';
import { CvsModule } from './cvs/cvs.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    CvTemplatesModule,
    CvsModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
