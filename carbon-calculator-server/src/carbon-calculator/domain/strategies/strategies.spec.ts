import { StationaryCombustionStrategy } from './stationary-combustion.strategy';
import { PurchasedEnergyStrategy } from './purchased-energy.strategy';
import { TransportStrategy } from './transport.strategy';
import { MaterialLifecycleStrategy } from './material-lifecycle.strategy';
import { FugitiveEmissionsStrategy } from './fugitive-emissions.strategy';

import { Volume } from '../../../shared/domain/value-objects/volume.vo';
import { VolumeUnit } from '../../../shared/domain/value-objects/volume.unit';
import { Mass } from '../../../shared/domain/value-objects/mass.vo';
import { MassUnit } from '../../../shared/domain/value-objects/mass.unit';
import { Energy } from '../../../shared/domain/value-objects/energy.vo';
import { EnergyUnit } from '../../../shared/domain/value-objects/energy.unit';
import { Distance } from '../../../shared/domain/value-objects/distance.vo';
import { DistanceUnit } from '../../../shared/domain/value-objects/distance.unit';

describe('Carbon calculator strategies', () => {
  describe('StationaryCombustionStrategy', () => {
    const strategy = new StationaryCombustionStrategy();

    it('calculates diesel emissions from volume (L)', () => {
      // 10 L diesel -> mass = 10 * 0.82 = 8.2 kg
      // E(GJ) = 8.2 * 43 / 1000 = 0.3526
      // Em(kg) = 0.3526 * 74.1 = 26.12766
      const result = strategy.calculate({
        fuelType: 'diesel',
        volume: Volume.of(10, VolumeUnit.L),
      });
      expect(result).toBeCloseTo(26.12766, 6);
    });

    it('calculates hard coal emissions from mass (t)', () => {
      // 1 t = 1000 kg
      // E(GJ) = 1000 * 22.55 / 1000 = 22.55
      // Em(kg) = 22.55 * 95.05 = 2143.3775
      const result = strategy.calculate({
        fuelType: 'hardCoal',
        mass: Mass.of(1, MassUnit.T),
      });
      expect(result).toBeCloseTo(2143.3775, 4);
    });

    it('calculates natural gas emissions from volume (m3)', () => {
      // Uses approximate density: 0.72 kg/m3
      // 1 m3 => 0.72 kg
      // E(GJ) = 0.72 * 54.8518518519 / 1000 = ~0.039493333...
      // Em(kg) = E * 56.1 = ~2.215576...
      const result = strategy.calculate({
        fuelType: 'naturalGas',
        volume: Volume.of(1, VolumeUnit.M3),
      });
      expect(result).toBeCloseTo(2.215576, 6);
    });

    it('throws if coal is provided as volume (density not configured)', () => {
      expect(() =>
        strategy.calculate({
          fuelType: 'hardCoal',
          volume: Volume.of(1, VolumeUnit.M3),
        }),
      ).toThrow(/Density/);
    });
  });

  describe('PurchasedEnergyStrategy', () => {
    const strategy = new PurchasedEnergyStrategy();

    it('converts kWh -> MWh and applies 698 kg/MWh', () => {
      const result = strategy.calculate({
        kind: 'electricity',
        energy: Energy.of(1000, EnergyUnit.KWH),
      });
      expect(result).toBe(698);
    });

    it('accepts GJ by converting to MWh via EnergyUnit', () => {
      // 1 GJ = 277.777... kWh = 0.277777... MWh
      const result = strategy.calculate({
        kind: 'electricity',
        energy: Energy.of(1, EnergyUnit.GJ),
      });
      expect(result).toBeCloseTo(0.2777777777777778 * 698, 6);
    });

    it('calculates district heat with kg/GJ factor (95.05 kg/GJ)', () => {
      const result = strategy.calculate({
        kind: 'districtHeat',
        energy: Energy.of(1, EnergyUnit.GJ),
      });
      expect(result).toBeCloseTo(95.05, 10);
    });

    it('throws on non-positive energy', () => {
      expect(() =>
        strategy.calculate({
          kind: 'electricity',
          energy: Energy.of(0, EnergyUnit.KWH),
        }),
      ).toThrow(/energy must be > 0/);
    });
  });

  describe('TransportStrategy', () => {
    const strategy = new TransportStrategy();

    it('calculates rail CO2 using kg/passenger-km (0.028)', () => {
      const result = strategy.calculate({
        mode: 'rail',
        distance: Distance.of(100, DistanceUnit.KM),
      });
      expect(result).toBeCloseTo(2.8, 10);
    });

    it('treats taxi and bus with same coefficient as rail', () => {
      const taxi = strategy.calculate({
        mode: 'taxi',
        distance: Distance.of(50, DistanceUnit.KM),
      });
      const bus = strategy.calculate({
        mode: 'bus',
        distance: Distance.of(50, DistanceUnit.KM),
      });
      expect(taxi).toBeCloseTo(1.4, 10);
      expect(bus).toBeCloseTo(1.4, 10);
    });

    it('classifies flight as short haul for < 300 miles', () => {
      const result = strategy.calculate({
        mode: 'flight',
        distance: Distance.of(100, DistanceUnit.MILE),
      });
      expect(result).toBeCloseTo(100 * 0.215, 10);
    });

    it('classifies flight as medium haul for 300..2300 miles', () => {
      const at300 = strategy.calculate({
        mode: 'flight',
        distance: Distance.of(300, DistanceUnit.MILE),
      });
      const at2300 = strategy.calculate({
        mode: 'flight',
        distance: Distance.of(2300, DistanceUnit.MILE),
      });
      expect(at300).toBeCloseTo(300 * 0.133, 10);
      expect(at2300).toBeCloseTo(2300 * 0.133, 10);
    });

    it('classifies flight as long haul for > 2300 miles', () => {
      const result = strategy.calculate({
        mode: 'flight',
        distance: Distance.of(2301, DistanceUnit.MILE),
      });
      expect(result).toBeCloseTo(2301 * 0.165, 10);
    });

    it('converts km -> miles for flight classification/calculation', () => {
      // 160.9344 km == 100 miles
      const result = strategy.calculate({
        mode: 'flight',
        distance: Distance.of(160.9344, DistanceUnit.KM),
      });
      expect(result).toBeCloseTo(100 * 0.215, 6);
    });
  });

  describe('MaterialLifecycleStrategy', () => {
    const strategy = new MaterialLifecycleStrategy();

    it('calculates water supply emissions (0.149 kg/m3)', () => {
      const result = strategy.calculate({
        type: 'waterSupply',
        quantity: Volume.of(10, VolumeUnit.M3),
      });
      expect(result).toBeCloseTo(1.49, 10);
    });

    it('calculates wastewater treatment emissions (0.272 kg/m3)', () => {
      const result = strategy.calculate({
        type: 'waterTreatment',
        quantity: Volume.of(10, VolumeUnit.M3),
      });
      expect(result).toBeCloseTo(2.72, 10);
    });

    it('calculates waste emissions (21.29 kg/t)', () => {
      const result = strategy.calculate({
        type: 'waste',
        quantity: Mass.of(1000, MassUnit.KG),
      });
      expect(result).toBeCloseTo(21.29, 10);
    });

    it('calculates paper production emissions (standard vs eco)', () => {
      const standard = strategy.calculate({
        type: 'paperProduction',
        paperType: 'standard',
        quantity: Mass.of(1000, MassUnit.KG),
      });
      const eco = strategy.calculate({
        type: 'paperProduction',
        paperType: 'eco',
        quantity: Mass.of(1000, MassUnit.KG),
      });
      expect(standard).toBeCloseTo(919.4, 10);
      expect(eco).toBeCloseTo(739.4, 10);
    });
  });

  describe('FugitiveEmissionsStrategy', () => {
    const strategy = new FugitiveEmissionsStrategy();

    it('calculates CO2e as kg refrigerant * GWP', () => {
      const result = strategy.calculate({
        refrigerant: 'R32',
        mass: Mass.of(1, MassUnit.KG),
      });
      expect(result).toBe(677);
    });
  });
});

