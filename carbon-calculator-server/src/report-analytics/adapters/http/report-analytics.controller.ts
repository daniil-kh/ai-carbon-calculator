import { Controller, Get, Query } from '@nestjs/common';
import { ReportAnalyticsService } from '../../application/report-analytics.service';
import type { TimeBucket } from '../../domain/models/carbon-report-timeseries.model';

@Controller('analytics/carbon-reports')
export class ReportAnalyticsController {
  constructor(private readonly analytics: ReportAnalyticsService) {}

  /**
   * GET /analytics/carbon-reports/summary?from=2026-01-01T00:00:00.000Z&to=2026-01-31T23:59:59.999Z
   */
  @Get('summary')
  async summary(@Query('from') from?: string, @Query('to') to?: string) {
    const now = new Date();
    const toDate = to ? parseIsoDate(to) : now;
    const fromDate = from
      ? parseIsoDate(from)
      : new Date(toDate.getTime() - 30 * 24 * 60 * 60 * 1000);

    return this.analytics.getSummary(fromDate, toDate);
  }

  /**
   * GET /analytics/carbon-reports/timeseries?bucket=day&from=...&to=...
   */
  @Get('timeseries')
  async timeseries(
    @Query('bucket') bucket?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const now = new Date();
    const toDate = to ? parseIsoDate(to) : now;
    const fromDate = from
      ? parseIsoDate(from)
      : new Date(toDate.getTime() - 30 * 24 * 60 * 60 * 1000);

    const timeBucket = parseBucket(bucket);
    return this.analytics.getTimeseries(fromDate, toDate, timeBucket);
  }
}

function parseIsoDate(value: string): Date {
  const d = new Date(value);
  if (!Number.isFinite(d.getTime())) {
    // Nest will translate thrown Error into 500, which is ok for now without DTO validation.
    // If you want 400, we can switch to class-validator pipes.
    throw new Error(`Invalid ISO date: ${value}`);
  }
  return d;
}

function parseBucket(value?: string): TimeBucket {
  if (value === 'week' || value === 'month' || value === 'day') return value;
  return 'day';
}

