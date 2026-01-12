export type TimeBucket = 'day' | 'week' | 'month';

export type CarbonReportTimeseriesPoint = {
  bucketStart: string; // ISO
  count: number; // frequency
  totalKgCO2eSum: number; // volume
  totalKgCO2eAvg: number;
};

export type CarbonReportTimeseries = {
  from: string; // ISO
  to: string; // ISO
  bucket: TimeBucket;
  points: CarbonReportTimeseriesPoint[];
};

