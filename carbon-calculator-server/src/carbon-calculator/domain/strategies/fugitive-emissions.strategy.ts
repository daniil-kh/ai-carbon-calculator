import { Injectable } from '@nestjs/common';
import { Mass } from '../../../shared/domain/value-objects/mass.vo';
import { MassUnit } from '../../../shared/domain/value-objects/mass.unit';
import { CarbonFootprintStrategy } from './carbon-footprint.strategy';

export type SupportedRefrigerant = 'R407C' | 'R410A' | 'R32';

export type FugitiveEmissionsInput = {
  /**
   * Mass of added / leaked refrigerant.
   * Supported units: `MassUnit.KG` or `MassUnit.T`
   */
  mass: Mass;
  refrigerant: SupportedRefrigerant;
};

/**
 * Global Warming Potential (GWP), kgCO2e/kg.
 */
const GWP: Record<SupportedRefrigerant, number> = {
  R407C: 1624,
  R410A: 1924,
  R32: 677,
};

@Injectable()
export class FugitiveEmissionsStrategy implements CarbonFootprintStrategy {
  readonly kind = 'FugitiveEmissions' as const;

  /**
   * EmCO2e = Mref(kg) * GWPref(kgCO2e/kg)
   */
  calculate(_input: unknown): number {
    const input = _input as FugitiveEmissionsInput;
    assertFugitiveEmissionsInput(input);

    const massKg = input.mass.to(MassUnit.KG).value;
    return massKg * GWP[input.refrigerant];
  }
}

function assertFugitiveEmissionsInput(input: FugitiveEmissionsInput): void {
  if (!input || typeof input !== 'object') {
    throw new Error('input must be an object');
  }
  if (!(input.mass instanceof Mass)) {
    throw new Error('mass must be a Mass value object');
  }
  if (input.mass.value <= 0) {
    throw new Error('mass must be > 0');
  }
  if (!['R407C', 'R410A', 'R32'].includes(input.refrigerant)) {
    throw new Error(`Unsupported refrigerant '${input.refrigerant}'`);
  }
}
