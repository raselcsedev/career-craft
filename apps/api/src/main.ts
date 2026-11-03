/*
 * NestJS Entry Point
 */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Cookie parser for reading JWT auth cookie
  app.use(cookieParser());

  // Global prefix: all routes start with /api/v1
  app.setGlobalPrefix('api/v1');

  // Enable CORS so the Next.js frontend (port 3000) can call this API (port 3001)
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN', 'http://localhost:3000'),
    credentials: true, // needed for cookies
  });

  // Global validation pipe: automatically validates incoming DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips properties not in the DTO
      forbidNonWhitelisted: true, // throws error if extra properties sent
      transform: true, // auto-transforms types
    }),
  );

  // Swagger API documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('CareerCraft API')
    .setDescription('REST API for CareerCraft CV Builder & Portfolio Platform')
    .setVersion('1.0')
    .addBearerAuth()
    .addCookieAuth('access_token')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  // Safely parse port (guard against malformed env vars) and bind to 0.0.0.0 for cloud hosting
  const rawPort = configService.get<string | number>('PORT', 3001);
  const parsedPort = typeof rawPort === 'number' ? rawPort : parseInt(String(rawPort), 10);
  const port = Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : 3001;

  await app.listen(port, '0.0.0.0');
  console.log(`🚀 CareerCraft API running on http://0.0.0.0:${port}`);
  console.log(`📚 Swagger docs at http://0.0.0.0:${port}/api/docs`);
}
bootstrap();
