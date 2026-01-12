import { Injectable } from '@nestjs/common';
import { CarbonReport } from '../../domain/models/carbon-report.model';
import { CarbonReportRepository } from '../../domain/ports/carbon-report.repository';

@Injectable()
export class InMemoryCarbonReportRepository implements CarbonReportRepository {
  private readonly store = new Map<string, CarbonReport>();

  save(report: CarbonReport): Promise<void> {
    this.store.set(report.id, report);
    return Promise.resolve();
  }

  findById(id: string): Promise<CarbonReport | null> {
    return Promise.resolve(this.store.get(id) ?? null);
  }
}
