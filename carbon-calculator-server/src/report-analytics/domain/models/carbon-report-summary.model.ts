export type CarbonReportSummary = {
  from: string; // ISO
  to: string; // ISO
  /**
   * How many whole/partial days are covered by [from, to].
   * Used for "frequency" metrics like avgReportsPerDay.
   */
  periodDays: number;
  /**
   * Frequency of calculator usage (report generation).
   */
  frequency: {
    avgReportsPerDay: number;
  };
  count: number;
  /**
   * Volume of generated carbon footprint (kgCO2e).
   */
  totalsKgCO2e: {
    sum: number;
    avg: number;
    min: number;
    max: number;
  };
  scopeTotalsKgCO2e: {
    scope1Avg: number;
    scope2Avg: number;
    scope3Avg: number;
  };
};

