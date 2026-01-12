export type DistanceDtoUnit = 'km' | 'mile';

export class CreateCarbonReportDto {
  scope1!: {
    stationaryCombustion: {
      naturalGasM3?: number;
      heatingMazutL?: number;
      coalT?: number;
      fleetGasolineL?: number;
      fleetDieselL?: number;
      generatorsDieselL?: number;
    };
    refrigerants: {
      r407cKg?: number;
      r32Kg?: number;
      r410aKg?: number;
    };
  };

  scope2!: {
    electricityKwh?: number;
    districtHeatGj?: number;
  };

  scope3!: {
    category1: {
      waterSupplyM3?: number;
      paperStandardKg?: number;
      paperEcoKg?: number;
    };
    category5: {
      wastewaterTreatmentM3?: number;
      wastePaperKg?: number;
      wasteMonitorsKg?: number;
      wasteElectronicsKg?: number;
      wasteTonersKg?: number;
    };
    category6: {
      flights?: {
        distance: number;
        unit: DistanceDtoUnit;
      };
      rail?: {
        distance: number;
        unit: DistanceDtoUnit;
      };
      taxi?: {
        distance: number;
        unit: DistanceDtoUnit;
      };
      bus?: {
        distance: number;
        unit: DistanceDtoUnit;
      };
    };
  };
}
