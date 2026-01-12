import { Module } from '@nestjs/common';
import { CarbonCalculatorModule } from './carbon-calculator/carbon-calculator.module';
import { ReportExportModule } from './report-export/report-export.module';
import { PrismaModule } from './shared/infrastructure/prisma/prisma.module';
import { ReportAnalyticsModule } from './report-analytics/report-analytics.module';

@Module({
  imports: [
    PrismaModule,
    CarbonCalculatorModule,
    ReportExportModule,
    ReportAnalyticsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
