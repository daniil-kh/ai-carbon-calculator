import { CreateCarbonReportDto } from '../adapters/http/create-carbon-report.dto';

/**
 * Reference test case (Poland) provided by the user.
 * Values are designed to validate both formulas and unit conversions.
 */
export const PL_REFERENCE_INPUT: CreateCarbonReportDto = {
  scope1: {
    stationaryCombustion: {
      naturalGasM3: 3000,
      heatingMazutL: 100000,
      coalT: 8,
      fleetGasolineL: 60000,
      fleetDieselL: 50000,
      generatorsDieselL: 1000,
    },
    refrigerants: {
      r407cKg: 1,
      r32Kg: 3,
      r410aKg: 8,
    },
  },
  scope2: {
    electricityKwh: 1_000_000,
    districtHeatGj: 10_000,
  },
  scope3: {
    category1: {
      waterSupplyM3: 2000,
      paperEcoKg: 10,
      paperStandardKg: 10,
    },
    category5: {
      wastewaterTreatmentM3: 2000,
      wastePaperKg: 10,
      wasteMonitorsKg: 100,
      wasteElectronicsKg: 1000,
      wasteTonersKg: 500,
    },
    category6: {
      // Reference route: WAW-AMS, 2,202 km (or 1,369 miles)
      flights: { distance: 2202, unit: 'km' },
      // Reference route: KTW-WAW, 297.7 km (or 184.99 miles)
      rail: { distance: 297.7, unit: 'km' },
    },
  },
};

// --- Expected reference outputs (kg CO2e) ---
export const PL_REFERENCE_EXPECTED = {
  scope1: {
    // Refrigerants
    refrigerantsKgCO2e: 1 * 1624 + 3 * 677 + 8 * 1924, // 19,047
    // Stationary combustion (based on reference energy equivalences + configured WE factors)
    stationaryCombustionKgCO2e:
      // Natural gas: 3,000 m3 => ~118.48 GJ; WE=56.1 kg/GJ
      118.48 * 56.1 +
      // Mazut: 100,000 L => 3,440 GJ; WE=74.1 kg/GJ
      3440 * 74.1 +
      // Hard coal: 8.00 t => 180.40 GJ; WE=95.05 kg/GJ
      180.4 * 95.05 +
      // Gasoline: 60,000 L => 1,913.76 GJ; WE=74.1 kg/GJ
      1913.76 * 74.1 +
      // Diesel (fleet): 50,000 L => 1,763 GJ; WE=74.1 kg/GJ
      1763 * 74.1 +
      // Diesel (generators): 1,000 L => 35.26 GJ; WE=74.1 kg/GJ
      35.26 * 74.1,
  },
  scope2: {
    electricityKgCO2e: 698_000,
    districtHeatKgCO2e: 950_500,
  },
  scope3: {
    category1KgCO2e: 298 + 7.39 + 9.19,
    category5KgCO2e: 544 + (0.21 + 2.13 + 21.29 + 10.65),
    // Category 6 is intentionally tested with tolerances (source-dependent transport factors)
    category6: {
      flightWawAmsKgCO2e: 183.57,
      railKtwWawKgCO2e: 8.51,
    },
  },
} as const;

