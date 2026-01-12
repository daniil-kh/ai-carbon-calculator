import { Module } from '@nestjs/common';
import { PrismaModule } from '../shared/infrastructure/prisma/prisma.module';
import { ReportAnalyticsController } from './adapters/http/report-analytics.controller';
import { ReportAnalyticsService } from './application/report-analytics.service';
import { PrismaCarbonReportAnalyticsRepository } from './infrastructure/repositories/prisma-carbon-report-analytics.repository';

@Module({
  imports: [PrismaModule],
  controllers: [ReportAnalyticsController],
  providers: [ReportAnalyticsService, PrismaCarbonReportAnalyticsRepository],
})
export class ReportAnalyticsModule {}

