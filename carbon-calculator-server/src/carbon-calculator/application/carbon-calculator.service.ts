import { Inject, Injectable } from '@nestjs/common';
import { CarbonFootprintStrategy } from '../domain/strategies/carbon-footprint.strategy';
import { FugitiveEmissionsStrategy } from '../domain/strategies/fugitive-emissions.strategy';
import { MaterialLifecycleStrategy } from '../domain/strategies/material-lifecycle.strategy';
import { PurchasedEnergyStrategy } from '../domain/strategies/purchased-energy.strategy';
import { StationaryCombustionStrategy } from '../domain/strategies/stationary-combustion.strategy';
import { TransportStrategy } from '../domain/strategies/transport.strategy';
import {
  CreateCarbonReportDto,
  DistanceDtoUnit,
} from '../adapters/http/create-carbon-report.dto';
import { Volume } from '../../shared/domain/value-objects/volume.vo';
import { VolumeUnit } from '../../shared/domain/value-objects/volume.unit';
import { Mass } from '../../shared/domain/value-objects/mass.vo';
import { MassUnit } from '../../shared/domain/value-objects/mass.unit';
import { Energy } from '../../shared/domain/value-objects/energy.vo';
import { EnergyUnit } from '../../shared/domain/value-objects/energy.unit';
import { Distance } from '../../shared/domain/value-objects/distance.vo';
import { DistanceUnit } from '../../shared/domain/value-objects/distance.unit';
import { CARBON_REPORT_REPOSITORY } from './tokens';
import type { CarbonReportRepository } from '../domain/ports/carbon-report.repository';
import {
  CarbonReport,
  CarbonReportTotals,
} from '../domain/models/carbon-report.model';

@Injectable()
export class CarbonCalculatorService {
  constructor(
    @Inject(CARBON_REPORT_REPOSITORY)
    private readonly reports: CarbonReportRepository,
    private readonly stationaryCombustion: StationaryCombustionStrategy,
    private readonly purchasedEnergy: PurchasedEnergyStrategy,
    private readonly fugitiveEmissions: FugitiveEmissionsStrategy,
    private readonly transport: TransportStrategy,
    private readonly materialLifecycle: MaterialLifecycleStrategy,
  ) {}

  /**
   * For now, this is just a structure placeholder. We'll evolve the input/output
   * types once calculation requirements are clarified.
   */
  listStrategies(): CarbonFootprintStrategy[] {
    return [
      this.stationaryCombustion,
      this.purchasedEnergy,
      this.fugitiveEmissions,
      this.transport,
      this.materialLifecycle,
    ];
  }

  async createReport(dto: CreateCarbonReportDto): Promise<CarbonReport> {
    // Scope 1
    const scope1Stationary = this.calculateScope1Stationary(dto);
    const scope1Refrigerants = this.calculateScope1Refrigerants(dto);
    const scope1Total = scope1Stationary + scope1Refrigerants;

    // Scope 2
    const scope2Total = this.calculateScope2(dto);

    // Scope 3
    const scope3Category1 = this.calculateScope3Category1(dto);
    const scope3Category5 = this.calculateScope3Category5(dto);
    const scope3Category6 = this.calculateScope3Category6(dto);
    const scope3Total = scope3Category1 + scope3Category5 + scope3Category6;

    const total = scope1Total + scope2Total + scope3Total;

    const totals: CarbonReportTotals = {
      totalKgCO2e: total,
      scope1: {
        stationaryCombustionKgCO2e: scope1Stationary,
        refrigerantsKgCO2e: scope1Refrigerants,
        totalKgCO2e: scope1Total,
      },
      scope2: {
        totalKgCO2e: scope2Total,
      },
      scope3: {
        category1KgCO2e: scope3Category1,
        category5KgCO2e: scope3Category5,
        category6KgCO2e: scope3Category6,
        totalKgCO2e: scope3Total,
      },
    };

    const report: CarbonReport = {
      id: createReportId(),
      createdAt: new Date().toISOString(),
      input: dto,
      totals,
    };

    await this.reports.save(report);
    return report;
  }

  private calculateScope1Stationary(dto: CreateCarbonReportDto): number {
    const s = dto.scope1?.stationaryCombustion;
    let total = 0;

    if (isPositiveNumber(s?.naturalGasM3)) {
      total += this.stationaryCombustion.calculate({
        fuelType: 'naturalGas',
        volume: Volume.of(s.naturalGasM3, VolumeUnit.M3),
      });
    }
    if (isPositiveNumber(s?.heatingMazutL)) {
      total += this.stationaryCombustion.calculate({
        fuelType: 'mazut',
        volume: Volume.of(s.heatingMazutL, VolumeUnit.L),
      });
    }
    if (isPositiveNumber(s?.coalT)) {
      total += this.stationaryCombustion.calculate({
        fuelType: 'hardCoal',
        mass: Mass.of(s.coalT, MassUnit.T),
      });
    }
    if (isPositiveNumber(s?.fleetGasolineL)) {
      total += this.stationaryCombustion.calculate({
        fuelType: 'gasoline',
        volume: Volume.of(s.fleetGasolineL, VolumeUnit.L),
      });
    }
    if (isPositiveNumber(s?.fleetDieselL)) {
      total += this.stationaryCombustion.calculate({
        fuelType: 'diesel',
        volume: Volume.of(s.fleetDieselL, VolumeUnit.L),
      });
    }
    if (isPositiveNumber(s?.generatorsDieselL)) {
      total += this.stationaryCombustion.calculate({
        fuelType: 'diesel',
        volume: Volume.of(s.generatorsDieselL, VolumeUnit.L),
      });
    }

    return total;
  }

  private calculateScope1Refrigerants(dto: CreateCarbonReportDto): number {
    const r = dto.scope1?.refrigerants;
    let total = 0;

    if (isPositiveNumber(r?.r407cKg)) {
      total += this.fugitiveEmissions.calculate({
        refrigerant: 'R407C',
        mass: Mass.of(r.r407cKg, MassUnit.KG),
      });
    }
    if (isPositiveNumber(r?.r32Kg)) {
      total += this.fugitiveEmissions.calculate({
        refrigerant: 'R32',
        mass: Mass.of(r.r32Kg, MassUnit.KG),
      });
    }
    if (isPositiveNumber(r?.r410aKg)) {
      total += this.fugitiveEmissions.calculate({
        refrigerant: 'R410A',
        mass: Mass.of(r.r410aKg, MassUnit.KG),
      });
    }

    return total;
  }

  private calculateScope2(dto: CreateCarbonReportDto): number {
    const s2 = dto.scope2;
    let total = 0;

    if (isPositiveNumber(s2?.electricityKwh)) {
      total += this.purchasedEnergy.calculate({
        kind: 'electricity',
        energy: Energy.of(s2.electricityKwh, EnergyUnit.KWH),
      });
    }
    if (isPositiveNumber(s2?.districtHeatGj)) {
      total += this.purchasedEnergy.calculate({
        kind: 'districtHeat',
        energy: Energy.of(s2.districtHeatGj, EnergyUnit.GJ),
      });
    }

    return total;
  }

  private calculateScope3Category1(dto: CreateCarbonReportDto): number {
    const c1 = dto.scope3?.category1;
    let total = 0;

    if (isPositiveNumber(c1?.waterSupplyM3)) {
      total += this.materialLifecycle.calculate({
        type: 'waterSupply',
        quantity: Volume.of(c1.waterSupplyM3, VolumeUnit.M3),
      });
    }
    if (isPositiveNumber(c1?.paperStandardKg)) {
      total += this.materialLifecycle.calculate({
        type: 'paperProduction',
        paperType: 'standard',
        quantity: Mass.of(c1.paperStandardKg, MassUnit.KG),
      });
    }
    if (isPositiveNumber(c1?.paperEcoKg)) {
      total += this.materialLifecycle.calculate({
        type: 'paperProduction',
        paperType: 'eco',
        quantity: Mass.of(c1.paperEcoKg, MassUnit.KG),
      });
    }

    return total;
  }

  private calculateScope3Category5(dto: CreateCarbonReportDto): number {
    const c5 = dto.scope3?.category5;
    let total = 0;

    if (isPositiveNumber(c5?.wastewaterTreatmentM3)) {
      total += this.materialLifecycle.calculate({
        type: 'waterTreatment',
        quantity: Volume.of(c5.wastewaterTreatmentM3, VolumeUnit.M3),
      });
    }

    const wasteKg =
      (isPositiveNumber(c5?.wastePaperKg) ? c5.wastePaperKg : 0) +
      (isPositiveNumber(c5?.wasteMonitorsKg) ? c5.wasteMonitorsKg : 0) +
      (isPositiveNumber(c5?.wasteElectronicsKg) ? c5.wasteElectronicsKg : 0) +
      (isPositiveNumber(c5?.wasteTonersKg) ? c5.wasteTonersKg : 0);

    if (wasteKg > 0) {
      total += this.materialLifecycle.calculate({
        type: 'waste',
        quantity: Mass.of(wasteKg, MassUnit.KG),
      });
    }

    return total;
  }

  private calculateScope3Category6(dto: CreateCarbonReportDto): number {
    const c6 = dto.scope3?.category6;
    let total = 0;

    if (c6?.flights && isPositiveNumber(c6.flights.distance)) {
      total += this.transport.calculate({
        mode: 'flight',
        distance: Distance.of(
          c6.flights.distance,
          toDistanceUnit(c6.flights.unit),
        ),
      });
    }
    if (c6?.rail && isPositiveNumber(c6.rail.distance)) {
      total += this.transport.calculate({
        mode: 'rail',
        distance: Distance.of(c6.rail.distance, toDistanceUnit(c6.rail.unit)),
      });
    }
    if (c6?.taxi && isPositiveNumber(c6.taxi.distance)) {
      total += this.transport.calculate({
        mode: 'taxi',
        distance: Distance.of(c6.taxi.distance, toDistanceUnit(c6.taxi.unit)),
      });
    }
    if (c6?.bus && isPositiveNumber(c6.bus.distance)) {
      total += this.transport.calculate({
        mode: 'bus',
        distance: Distance.of(c6.bus.distance, toDistanceUnit(c6.bus.unit)),
      });
    }

    return total;
  }
}

function createReportId(): string {
  // Good enough for in-memory repository; we can switch to UUID later.
  return `cr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function toDistanceUnit(unit: DistanceDtoUnit): DistanceUnit {
  return unit === 'km' ? DistanceUnit.KM : DistanceUnit.MILE;
}

function isPositiveNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}
