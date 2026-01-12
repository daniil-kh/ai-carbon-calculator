import { Injectable } from '@nestjs/common';
import { CarbonReportSummary } from '../domain/models/carbon-report-summary.model';
import { PrismaCarbonReportAnalyticsRepository } from '../infrastructure/repositories/prisma-carbon-report-analytics.repository';
import {
  CarbonReportTimeseries,
  TimeBucket,
} from '../domain/models/carbon-report-timeseries.model';

@Injectable()
export class ReportAnalyticsService {
  constructor(
    private readonly repo: PrismaCarbonReportAnalyticsRepository,
  ) {}

  async getSummary(from: Date, to: Date): Promise<CarbonReportSummary> {
    const totals = await this.repo.findTotalsInRange(from, to);

    const count = totals.length;
    const totalValues = totals.map((t) => safeNumber(t.totalKgCO2e));

    const scope1Values = totals.map((t) => safeNumber(t.scope1?.totalKgCO2e));
    const scope2Values = totals.map((t) => safeNumber(t.scope2?.totalKgCO2e));
    const scope3Values = totals.map((t) => safeNumber(t.scope3?.totalKgCO2e));

    const totalsStats = stats(totalValues);
    const periodDays = calcPeriodDays(from, to);

    return {
      from: from.toISOString(),
      to: to.toISOString(),
      periodDays,
      frequency: {
        avgReportsPerDay: periodDays > 0 ? count / periodDays : count,
      },
      count,
      totalsKgCO2e: totalsStats,
      scopeTotalsKgCO2e: {
        scope1Avg: avg(scope1Values),
        scope2Avg: avg(scope2Values),
        scope3Avg: avg(scope3Values),
      },
    };
  }

  async getTimeseries(
    from: Date,
    to: Date,
    bucket: TimeBucket,
  ): Promise<CarbonReportTimeseries> {
    const rows = await this.repo.getTimeseries(from, to, bucket);
    return {
      from: from.toISOString(),
      to: to.toISOString(),
      bucket,
      points: rows.map((r) => ({
        bucketStart: r.bucketStart.toISOString(),
        count: r.count,
        totalKgCO2eSum: r.totalKgCO2eSum,
        totalKgCO2eAvg: r.totalKgCO2eAvg,
      })),
    };
  }
}

function safeNumber(v: unknown): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : 0;
}

function calcPeriodDays(from: Date, to: Date): number {
  const ms = to.getTime() - from.getTime();
  if (!Number.isFinite(ms) || ms <= 0) return 0;
  return Math.max(1, Math.ceil(ms / (24 * 60 * 60 * 1000)));
}

function avg(values: number[]): number {
  if (values.length === 0) return 0;
  return sum(values) / values.length;
}

function sum(values: number[]): number {
  let s = 0;
  for (const v of values) s += v;
  return s;
}

function stats(values: number[]): { sum: number; avg: number; min: number; max: number } {
  if (values.length === 0) return { sum: 0, avg: 0, min: 0, max: 0 };
  let min = values[0]!;
  let max = values[0]!;
  let s = 0;
  for (const v of values) {
    s += v;
    if (v < min) min = v;
    if (v > max) max = v;
  }
  return {
    sum: s,
    avg: s / values.length,
    min,
    max,
  };
}

