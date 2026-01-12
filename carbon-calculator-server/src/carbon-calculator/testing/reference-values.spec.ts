import { Test } from '@nestjs/testing';
import { CarbonCalculatorModule } from '../carbon-calculator.module';
import { CarbonCalculatorService } from '../application/carbon-calculator.service';
import { Energy } from '../../shared/domain/value-objects/energy.vo';
import { EnergyUnit } from '../../shared/domain/value-objects/energy.unit';
import { PurchasedEnergyStrategy } from '../domain/strategies/purchased-energy.strategy';
import { TransportStrategy } from '../domain/strategies/transport.strategy';
import { Distance } from '../../shared/domain/value-objects/distance.vo';
import { DistanceUnit } from '../../shared/domain/value-objects/distance.unit';
import { PL_REFERENCE_EXPECTED, PL_REFERENCE_INPUT } from './pl-reference-case';

function expectWithin(
  actual: number,
  expected: number,
  toleranceAbs: number,
): void {
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(toleranceAbs);
}

describe('Reference values (PL) — formulas + unit conversions', () => {
  it('Energy unit conversion: 1 kWh = 0.0036 GJ', () => {
    const oneKwhInGj = Energy.of(1, EnergyUnit.KWH).to(EnergyUnit.GJ).value;
    expectWithin(oneKwhInGj, 0.0036, 1e-12);
  });

  it('Purchased energy (Scope 2): electricity and district heat use different factors', () => {
    const purchased = new PurchasedEnergyStrategy();

    const electricityKg = purchased.calculate({
      kind: 'electricity',
      energy: Energy.of(1_000_000, EnergyUnit.KWH),
    });
    expectWithin(electricityKg, PL_REFERENCE_EXPECTED.scope2.electricityKgCO2e, 1e-9);

    const heatKg = purchased.calculate({
      kind: 'districtHeat',
      energy: Energy.of(10_000, EnergyUnit.GJ),
    });
    expectWithin(heatKg, PL_REFERENCE_EXPECTED.scope2.districtHeatKgCO2e, 1e-9);
  });

  it('Transport reference routes are close to provided reference emissions (tolerant)', () => {
    const transport = new TransportStrategy();

    const flightKg = transport.calculate({
      mode: 'flight',
      distance: Distance.of(2202, DistanceUnit.KM),
    });
    // Reference: 183.57 kg; allow small absolute tolerance due to factor-source differences
    expectWithin(flightKg, PL_REFERENCE_EXPECTED.scope3.category6.flightWawAmsKgCO2e, 2.0);

    const railKg = transport.calculate({
      mode: 'rail',
      distance: Distance.of(297.7, DistanceUnit.KM),
    });
    // Reference: 8.51 kg; allow small tolerance
    expectWithin(railKg, PL_REFERENCE_EXPECTED.scope3.category6.railKtwWawKgCO2e, 0.3);
  });

  it('CarbonCalculatorService end-to-end totals match the provided reference case (with transport tolerance)', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CarbonCalculatorModule],
    }).compile();

    const service = moduleRef.get(CarbonCalculatorService);
    const report = await service.createReport(PL_REFERENCE_INPUT);

    // Scope 1
    expectWithin(
      report.totals.scope1.refrigerantsKgCO2e,
      PL_REFERENCE_EXPECTED.scope1.refrigerantsKgCO2e,
      1e-9,
    );
    expectWithin(
      report.totals.scope1.stationaryCombustionKgCO2e,
      PL_REFERENCE_EXPECTED.scope1.stationaryCombustionKgCO2e,
      1.0,
    );

    // Scope 2
    expectWithin(
      report.totals.scope2.totalKgCO2e,
      PL_REFERENCE_EXPECTED.scope2.electricityKgCO2e +
        PL_REFERENCE_EXPECTED.scope2.districtHeatKgCO2e,
      1e-9,
    );

    // Scope 3 (cat1/cat5 are deterministic)
    expectWithin(
      report.totals.scope3.category1KgCO2e,
      PL_REFERENCE_EXPECTED.scope3.category1KgCO2e,
      0.05,
    );
    expectWithin(
      report.totals.scope3.category5KgCO2e,
      PL_REFERENCE_EXPECTED.scope3.category5KgCO2e,
      0.05,
    );

    // Scope 3 category 6: tolerant (depends on transport factors)
    expectWithin(report.totals.scope3.category6KgCO2e, 183.57 + 8.51, 3.0);

    // Total: tolerant because includes category 6
    const expectedTotalMin =
      (PL_REFERENCE_EXPECTED.scope1.refrigerantsKgCO2e +
        PL_REFERENCE_EXPECTED.scope1.stationaryCombustionKgCO2e) +
      (PL_REFERENCE_EXPECTED.scope2.electricityKgCO2e +
        PL_REFERENCE_EXPECTED.scope2.districtHeatKgCO2e) +
      (PL_REFERENCE_EXPECTED.scope3.category1KgCO2e +
        PL_REFERENCE_EXPECTED.scope3.category5KgCO2e) +
      (183.57 + 8.51) -
      3.0;
    const expectedTotalMax = expectedTotalMin + 6.0;

    expect(report.totals.totalKgCO2e).toBeGreaterThanOrEqual(expectedTotalMin);
    expect(report.totals.totalKgCO2e).toBeLessThanOrEqual(expectedTotalMax);
  });
});

