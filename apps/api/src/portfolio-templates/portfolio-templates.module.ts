import { Module } from '@nestjs/common';
import { PortfolioTemplatesController } from './portfolio-templates.controller';

@Module({
  controllers: [PortfolioTemplatesController],
})
export class PortfolioTemplatesModule {}
