import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CarbonReport } from '../../domain/models/carbon-report.model';
import { CarbonReportRepository } from '../../domain/ports/carbon-report.repository';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaCarbonReportRepository implements CarbonReportRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(report: CarbonReport): Promise<void> {
    await this.prisma.carbonReport.upsert({
      where: { id: report.id },
      create: {
        id: report.id,
        createdAt: new Date(report.createdAt),
        input: report.input as unknown as Prisma.InputJsonValue,
        totals: report.totals as unknown as Prisma.InputJsonValue,
      },
      update: {
        createdAt: new Date(report.createdAt),
        input: report.input as unknown as Prisma.InputJsonValue,
        totals: report.totals as unknown as Prisma.InputJsonValue,
      },
    });
  }

  async findById(id: string): Promise<CarbonReport | null> {
    const row = await this.prisma.carbonReport.findUnique({ where: { id } });
    if (!row) return null;

    return {
      id: row.id,
      createdAt: row.createdAt.toISOString(),
      input: row.input as unknown as CarbonReport['input'],
      totals: row.totals as unknown as CarbonReport['totals'],
    };
  }
}

