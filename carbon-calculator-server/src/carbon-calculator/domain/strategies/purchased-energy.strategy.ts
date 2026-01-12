import { Injectable } from '@nestjs/common';
import { CarbonFootprintStrategy } from './carbon-footprint.strategy';
import { Energy } from '../../../shared/domain/value-objects/energy.vo';
import { EnergyUnit } from '../../../shared/domain/value-objects/energy.unit';

export type PurchasedEnergyKind = 'electricity' | 'districtHeat';

export type PurchasedEnergyInput = {
  /**
   * Distinguishes the coefficient used for electricity vs district heat.
   */
  kind: PurchasedEnergyKind;
  /**
   * Purchased energy consumed (electricity / heat). Any supported `EnergyUnit`.
   */
  energy: Energy;
};

/**
 * Constant emission factor for electricity (CO2): 698 kg/MWh
 */
const ELECTRICITY_CO2_KG_PER_MWH = 698;

/**
 * Constant emission factor for district heat (CO2): 95.05 kg/GJ
 */
const DISTRICT_HEAT_CO2_KG_PER_GJ = 95.05;

@Injectable()
export class PurchasedEnergyStrategy implements CarbonFootprintStrategy {
  readonly kind = 'PurchasedEnergy' as const;

  /**
   * Scope 2 — purchased energy.
   *
   * EmCO2 (kg) =
   * - electricity: Energy(MWh) * 698 (kg/MWh)
   * - districtHeat: Energy(GJ) * 95.05 (kg/GJ)
   */
  calculate(_input: unknown): number {
    const input = _input as PurchasedEnergyInput;
    assertPurchasedEnergyInput(input);

    if (input.kind === 'electricity') {
      const energyMWh = input.energy.to(EnergyUnit.MWH).value;
      return energyMWh * ELECTRICITY_CO2_KG_PER_MWH;
    }

    const energyGJ = input.energy.to(EnergyUnit.GJ).value;
    return energyGJ * DISTRICT_HEAT_CO2_KG_PER_GJ;
  }
}

function assertPurchasedEnergyInput(input: PurchasedEnergyInput): void {
  if (!input || typeof input !== 'object') {
    throw new Error('input must be an object');
  }
  if (!('kind' in input) || (input.kind !== 'electricity' && input.kind !== 'districtHeat')) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    throw new Error(`kind must be 'electricity' or 'districtHeat' (got '${String((input as any).kind)}')`);
  }
  if (!('energy' in input) || !(input.energy instanceof Energy)) {
    throw new Error('energy must be an Energy value object');
  }
  if (input.energy.value <= 0) {
    throw new Error('energy must be > 0');
  }
}
