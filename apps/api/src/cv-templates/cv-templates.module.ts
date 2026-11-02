import { Module } from '@nestjs/common';
import { CvTemplatesController } from './cv-templates.controller';

@Module({
  controllers: [CvTemplatesController],
})
export class CvTemplatesModule {}
