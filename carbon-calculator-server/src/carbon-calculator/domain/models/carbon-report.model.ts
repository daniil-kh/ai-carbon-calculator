import { CreateCarbonReportDto } from '../../adapters/http/create-carbon-report.dto';

export type CarbonReportTotals = {
  totalKgCO2e: number;
  scope1: {
    stationaryCombustionKgCO2e: number;
    refrigerantsKgCO2e: number;
    totalKgCO2e: number;
  };
  scope2: {
    totalKgCO2e: number;
  };
  scope3: {
    category1KgCO2e: number;
    category5KgCO2e: number;
    category6KgCO2e: number;
    totalKgCO2e: number;
  };
};

export type CarbonReport = {
  id: string;
  createdAt: string; // ISO
  input: CreateCarbonReportDto;
  totals: CarbonReportTotals;
};
