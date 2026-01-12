import { Injectable } from '@nestjs/common';
import { CarbonFootprintStrategy } from './carbon-footprint.strategy';
import { Mass } from '../../../shared/domain/value-objects/mass.vo';
import { MassUnit } from '../../../shared/domain/value-objects/mass.unit';
import { Volume } from '../../../shared/domain/value-objects/volume.vo';
import { VolumeUnit } from '../../../shared/domain/value-objects/volume.unit';

export type MaterialLifecycleInput =
  | {
      /**
       * Water supply: kgCO2e/m3 = 0.149
       */
      type: 'waterSupply';
      quantity: Volume;
    }
  | {
      /**
       * Water treatment: kgCO2e/m3 = 0.272
       */
      type: 'waterTreatment';
      quantity: Volume;
    }
  | {
      /**
       * Waste disposal (paper/e-waste/toners etc.).
       * kgCO2e/t = 21.29
       */
      type: 'waste';
      quantity: Mass;
    }
  | {
      /**
       * Paper production footprint for office purchases.
       * kgCO2e/t:
       * - standard: 919.4
       * - eco: 739.4
       */
      type: 'paperProduction';
      paperType: 'standard' | 'eco';
      quantity: Mass;
    };

const WATER_SUPPLY_KG_PER_M3 = 0.149;
const WATER_TREATMENT_KG_PER_M3 = 0.272;

const WASTE_DISPOSAL_KG_PER_T = 21.29;

const PAPER_PRODUCTION_KG_PER_T: Record<'standard' | 'eco', number> = {
  standard: 919.4,
  eco: 739.4,
};

@Injectable()
export class MaterialLifecycleStrategy implements CarbonFootprintStrategy {
  readonly kind = 'MaterialLifecycle' as const;

  calculate(_input: unknown): number {
    const input = _input as MaterialLifecycleInput;
    assertMaterialLifecycleInput(input);

    if (input.type === 'waterSupply') {
      const m3 = input.quantity.to(VolumeUnit.M3).value;
      return m3 * WATER_SUPPLY_KG_PER_M3;
    }

    if (input.type === 'waterTreatment') {
      const m3 = input.quantity.to(VolumeUnit.M3).value;
      return m3 * WATER_TREATMENT_KG_PER_M3;
    }

    if (input.type === 'waste') {
      const t = input.quantity.to(MassUnit.T).value;
      return t * WASTE_DISPOSAL_KG_PER_T;
    }

    // paperProduction
    const t = input.quantity.to(MassUnit.T).value;
    return t * PAPER_PRODUCTION_KG_PER_T[input.paperType];
  }
}

function assertMaterialLifecycleInput(input: MaterialLifecycleInput): void {
  if (!input || typeof input !== 'object') {
    throw new Error('input must be an object');
  }
  if (!('type' in input)) {
    throw new Error('type is required');
  }

  if (input.type === 'waterSupply' || input.type === 'waterTreatment') {
    if (!(input.quantity instanceof Volume)) {
      throw new Error('quantity must be a Volume value object');
    }
    if (input.quantity.value <= 0) throw new Error('quantity must be > 0');
    return;
  }

  if (input.type === 'waste') {
    if (!(input.quantity instanceof Mass)) {
      throw new Error('quantity must be a Mass value object');
    }
    if (input.quantity.value <= 0) throw new Error('quantity must be > 0');
    return;
  }

  if (input.type === 'paperProduction') {
    if (!(input.quantity instanceof Mass)) {
      throw new Error('quantity must be a Mass value object');
    }
    if (input.quantity.value <= 0) throw new Error('quantity must be > 0');
    if (input.paperType !== 'standard' && input.paperType !== 'eco') {
      throw new Error(`Unsupported paperType '${String(input.paperType)}'`);
    }
    return;
  }
}
