import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CARBON_REPORT_REPOSITORY } from '../../carbon-calculator/application/tokens';
import type { CarbonReportRepository } from '../../carbon-calculator/domain/ports/carbon-report.repository';
import type { PdfReportRenderer } from '../domain/ports/pdf-report-renderer.port';
import { PDF_REPORT_RENDERER } from './tokens';

@Injectable()
export class ReportExportService {
  constructor(
    @Inject(CARBON_REPORT_REPOSITORY)
    private readonly reports: CarbonReportRepository,
    @Inject(PDF_REPORT_RENDERER)
    private readonly renderer: PdfReportRenderer,
  ) {}

  async exportCarbonReportPdf(reportId: string): Promise<Buffer> {
    const report = await this.reports.findById(reportId);
    if (!report) {
      throw new NotFoundException(`Carbon report not found: ${reportId}`);
    }

    return this.renderer.render(report);
  }
}

