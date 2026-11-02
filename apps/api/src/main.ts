/*
 * NestJS Entry Point
 * 
 * This file boots the NestJS application.
 * 
 * 🔑 NestJS Concept: main.ts
 * Think of this like your Next.js server startup, but for the backend.
 * It creates the app from AppModule (the root module), configures middleware
 * (like CORS, validation, Swagger docs), and starts listening on a port.
 */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Global prefix: all routes start with /api/v1
  app.setGlobalPrefix('api/v1');

  // Enable CORS so the Next.js frontend (port 3000) can call this API (port 3001)
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN', 'http://localhost:3000'),
    credentials: true, // needed for cookies
  });

  // Global validation pipe: automatically validates incoming DTOs
  // This is like adding Zod validation to every API route automatically
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips properties not in the DTO
      forbidNonWhitelisted: true, // throws error if extra properties sent
      transform: true, // auto-transforms types (e.g., string "1" → number 1)
    }),
  );

  // Swagger API documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('CareerCraft API')
    .setDescription('REST API for the CareerCraft CV Builder & Portfolio Platform')
    .setVersion('1.0')
    .addCookieAuth('access_token')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get<number>('PORT', 3001);
  await app.listen(port);
  console.log(`🚀 CareerCraft API running on http://localhost:${port}`);
  console.log(`📚 Swagger docs at http://localhost:${port}/api/docs`);
}
bootstrap();
