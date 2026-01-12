import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
import type { TimeBucket } from '../../domain/models/carbon-report-timeseries.model';

type TotalsJson = {
  totalKgCO2e: number;
  scope1?: { totalKgCO2e: number };
  scope2?: { totalKgCO2e: number };
  scope3?: { totalKgCO2e: number };
};

@Injectable()
export class PrismaCarbonReportAnalyticsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findTotalsInRange(from: Date, to: Date): Promise<TotalsJson[]> {
    const rows = await this.prisma.carbonReport.findMany({
      where: {
        createdAt: {
          gte: from,
          lte: to,
        },
      },
      select: {
        totals: true,
      },
    });

    return rows
      .map((r) => r.totals as unknown as Prisma.JsonValue)
      .map((t) => (isObject(t) ? (t as TotalsJson) : null))
      .filter((t): t is TotalsJson => !!t && typeof t.totalKgCO2e === 'number');
  }

  async getTimeseries(
    from: Date,
    to: Date,
    bucket: TimeBucket,
  ): Promise<
    Array<{
      bucketStart: Date;
      count: number;
      totalKgCO2eSum: number;
      totalKgCO2eAvg: number;
    }>
  > {
    // We use SQL because Prisma groupBy can't easily do Postgres date_trunc().
    const rows = await this.prisma.$queryRaw<
      Array<{
        bucket_start: Date;
        count: bigint;
        total_kgco2e_sum: number | null;
        total_kgco2e_avg: number | null;
      }>
    >(
      Prisma.sql`
        SELECT
          date_trunc(${bucket}::text, "createdAt") AS bucket_start,
          COUNT(*) AS count,
          SUM((totals->>'totalKgCO2e')::double precision) AS total_kgco2e_sum,
          AVG((totals->>'totalKgCO2e')::double precision) AS total_kgco2e_avg
        FROM "CarbonReport"
        WHERE "createdAt" >= ${from} AND "createdAt" <= ${to}
        GROUP BY bucket_start
        ORDER BY bucket_start ASC
      `,
    );

    return rows.map((r) => ({
      bucketStart: r.bucket_start,
      count: Number(r.count),
      totalKgCO2eSum: r.total_kgco2e_sum ?? 0,
      totalKgCO2eAvg: r.total_kgco2e_avg ?? 0,
    }));
  }
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

