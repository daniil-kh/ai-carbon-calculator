import { CarbonReport } from '../../../carbon-calculator/domain/models/carbon-report.model';

export interface PdfReportRenderer {
  render(report: CarbonReport): Promise<Buffer>;
}

