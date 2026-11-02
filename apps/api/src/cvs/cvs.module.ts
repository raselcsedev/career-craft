import { Module } from '@nestjs/common';
import { CvsService } from './cvs.service';
import { CvsController } from './cvs.controller';
import { CvParserService } from './cv-parser.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [CvsController],
  providers: [CvsService, CvParserService],
  exports: [CvsService, CvParserService],
})
export class CvsModule {}
