import { Module } from '@nestjs/common';
import { CarbonCalculatorModule } from '../carbon-calculator/carbon-calculator.module';
import { ReportExportController } from './adapters/http/report-export.controller';
import { ReportExportService } from './application/report-export.service';
import { PDF_REPORT_RENDERER } from './application/tokens';
import { PdfKitReportRenderer } from './infrastructure/pdfkit/pdfkit-report-renderer';

@Module({
  imports: [CarbonCalculatorModule],
  controllers: [ReportExportController],
  providers: [
    ReportExportService,
    {
      provide: PDF_REPORT_RENDERER,
      useClass: PdfKitReportRenderer,
    },
  ],
})
export class ReportExportModule {}

