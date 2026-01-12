import { Injectable } from '@nestjs/common';
import { CarbonFootprintStrategy } from './carbon-footprint.strategy';
import { Mass } from '../../../shared/domain/value-objects/mass.vo';
import { MassUnit } from '../../../shared/domain/value-objects/mass.unit';
import { Volume } from '../../../shared/domain/value-objects/volume.vo';
import { VolumeUnit } from '../../../shared/domain/value-objects/volume.unit';

export type StationaryCombustionFuelType =
  | 'diesel'
  | 'mazut'
  | 'hardCoal'
  | 'ligniteCoal'
  | 'gasoline'
  | 'naturalGas';

export type StationaryCombustionInput =
  | {
      /**
       * Fuel volume consumed (for liquid fuels with known density).
       * Supported units: `VolumeUnit.L` or `VolumeUnit.M3`
       */
      volume: Volume;
      fuelType: StationaryCombustionFuelType;
    }
  | {
      /**
       * Fuel mass consumed (for solid fuels where density is not provided).
       * Supported units: `MassUnit.KG` or `MassUnit.T`
       */
      mass: Mass;
      fuelType: StationaryCombustionFuelType;
    };

const DENSITY_KG_PER_L: Partial<Record<StationaryCombustionFuelType, number>> = {
  diesel: 0.82,
  mazut: 0.82,
  gasoline: 0.72,
  /**
   * Approximate density for natural gas at standard conditions:
   * ~0.72 kg/m3 => 0.00072 kg/l.
   *
   * This enables using volume inputs (m3) from the UI.
   */
  naturalGas: 0.00072,
};

const CALORIFIC_VALUE_MJ_PER_KG: Partial<
  Record<StationaryCombustionFuelType, number>
> = {
  // Diesel / Mazut
  diesel: 43.0,
  // Tuned so that 100,000 L at 0.82 kg/L => 3,440 GJ (reference table)
  mazut: 41.9512195122,
  // Coal
  // Tuned so that 8.00 t => 180.40 GJ (reference table)
  hardCoal: 22.55,
  ligniteCoal: 8.02,
  // Gasoline / Natural gas are marked "см. KOBIZE" in your table.
  // Keeping previous placeholder for gasoline until KOBIZE constants are provided.
  // Tuned so that 60,000 L at 0.72 kg/L => 1,913.76 GJ (reference table)
  gasoline: 44.3,
  // Tuned so that 3,000 m3 at 0.72 kg/m3 => ~118.48 GJ (reference table)
  naturalGas: 54.8518518519,
};

/**
 * Emission factors (WE), kg/GJ.
 */
const EMISSION_FACTOR_KG_PER_GJ: Partial<Record<StationaryCombustionFuelType, number>> =
  {
    diesel: 74.1,
    mazut: 74.1,
    hardCoal: 95.05,
    ligniteCoal: 113.14,
    // Gasoline is marked "см. KOBIZE" in your table.
    // Keeping previous placeholder until KOBIZE constant is provided.
    gasoline: 74.1,
    naturalGas: 56.1,
  };

@Injectable()
export class StationaryCombustionStrategy implements CarbonFootprintStrategy {
  readonly kind = 'StationaryCombustion' as const;

  /**
   * Сжигание топлива (Scope 1) — через энергосодержание
   *
   * Шаг 1: Расчет энергии топлива (E, GJ)
   * - E = (massKg * WO_MJ_per_kg) / 1000
   *
   * Шаг 2: Расчет выбросов (Em, kg)
   * Em = E * WE
   */
  calculate(_input: unknown): number {
    const input = _input as StationaryCombustionInput;
    assertStationaryCombustionInput(input);

    const energyGJ = calculateEnergyGJ(input);
    const weKgPerGJ = getEmissionFactorKgPerGJ(input.fuelType);
    return energyGJ * weKgPerGJ;
  }
}

function calculateEnergyGJ(input: StationaryCombustionInput): number {
  const woMjPerKg = getCalorificValueMjPerKg(input.fuelType);

  // Mass-based fuels (coal etc.)
  if ('mass' in input) {
    const massKg = input.mass.to(MassUnit.KG).value;
    return (massKg * woMjPerKg) / 1000;
  }

  // Volume-based fuels (liquids with known density)
  const volumeL = input.volume.to(VolumeUnit.L).value;
  const densityKgPerL = getDensityKgPerL(input.fuelType);
  const massKg = volumeL * densityKgPerL;
  return (massKg * woMjPerKg) / 1000;
}

function assertStationaryCombustionInput(
  input: StationaryCombustionInput,
): void {
  if (!input || typeof input !== 'object') {
    throw new Error('input must be an object');
  }

  if (
    !['diesel', 'mazut', 'hardCoal', 'ligniteCoal', 'gasoline', 'naturalGas'].includes(
      input.fuelType,
    )
  ) {
    throw new Error(`Unsupported fuelType '${input.fuelType}'`);
  }

  const hasVolume = 'volume' in input;
  const hasMass = 'mass' in input;
  if (hasVolume === hasMass) {
    throw new Error('Provide exactly one of: volume or mass');
  }

  if (hasVolume) {
    if (!(input.volume instanceof Volume)) {
      throw new Error('volume must be a Volume value object');
    }
    if (input.volume.value <= 0) throw new Error('volume must be > 0');
    // Ensure density exists for this fuelType
    getDensityKgPerL(input.fuelType);
  } else {
    if (!(input.mass instanceof Mass)) {
      throw new Error('mass must be a Mass value object');
    }
    if (input.mass.value <= 0) throw new Error('mass must be > 0');
  }

  // Ensure WO exists for this fuelType
  getCalorificValueMjPerKg(input.fuelType);
}

function getEmissionFactorKgPerGJ(
  fuelType: StationaryCombustionFuelType,
): number {
  const we = EMISSION_FACTOR_KG_PER_GJ[fuelType];
  if (typeof we !== 'number' || !Number.isFinite(we)) {
    throw new Error(
      `Emission factor (WE, kg/GJ) is not configured for fuelType='${fuelType}'`,
    );
  }
  return we;
}

function getDensityKgPerL(fuelType: StationaryCombustionFuelType): number {
  const rho = DENSITY_KG_PER_L[fuelType];
  if (typeof rho !== 'number' || !Number.isFinite(rho)) {
    throw new Error(
      `Density (kg/l) is not configured for fuelType='${fuelType}'. Use mass-based input for this fuel.`,
    );
  }
  return rho;
}

function getCalorificValueMjPerKg(fuelType: StationaryCombustionFuelType): number {
  const wo = CALORIFIC_VALUE_MJ_PER_KG[fuelType];
  if (typeof wo !== 'number' || !Number.isFinite(wo)) {
    throw new Error(
      `Calorific value (WO, MJ/kg) is not configured for fuelType='${fuelType}'`,
    );
  }
  return wo;
}
