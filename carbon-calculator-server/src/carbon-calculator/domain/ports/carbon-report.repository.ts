import { CarbonReport } from '../models/carbon-report.model';

export interface CarbonReportRepository {
  save(report: CarbonReport): Promise<void>;
  findById(id: string): Promise<CarbonReport | null>;
}
