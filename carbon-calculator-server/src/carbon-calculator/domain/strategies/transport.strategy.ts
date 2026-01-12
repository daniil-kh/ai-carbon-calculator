import { Injectable } from '@nestjs/common';
import { CarbonFootprintStrategy } from './carbon-footprint.strategy';
import { Distance } from '../../../shared/domain/value-objects/distance.vo';
import { DistanceUnit } from '../../../shared/domain/value-objects/distance.unit';

export type TransportInput =
  | {
      mode: 'flight';
      distance: Distance;
    }
  | {
      mode: 'rail' | 'taxi' | 'bus';
      distance: Distance;
    };

// --- Flight (per passenger-mile) ---
type FlightHaul = 'short' | 'medium' | 'long';

const FLIGHT_CO2_KG_PER_PASSENGER_MILE: Record<FlightHaul, number> = {
  short: 0.215,
  medium: 0.133,
  long: 0.165,
};

// Thresholds in miles (EPA-style)
const SHORT_HAUL_MAX_MILES = 300; // < 300
const MEDIUM_HAUL_MAX_MILES = 2300; // 300..2300

// --- Rail / taxi / bus ---
// Document: 0.028 kg / passenger-km (reused for taxi and bus)
const RAIL_LIKE_CO2_KG_PER_PASSENGER_KM = 0.028;

@Injectable()
export class TransportStrategy implements CarbonFootprintStrategy {
  readonly kind = 'Transport' as const;

  /**
   * Em_gas = D * WE_trans
   * Then sum gases (CO2 + CH4 + N2O). For now we only have CO2 factors.
   */
  calculate(_input: unknown): number {
    const input = _input as TransportInput;
    assertTransportInput(input);

    // Convert distance into required base units for each coefficient
    const distanceMiles = input.distance.to(DistanceUnit.MILE).value;
    const distanceKm = input.distance.to(DistanceUnit.KM).value;

    // Base formula 1: CO2 + CH4 + N2O (kg). CH4/N2O are not specified yet.
    let co2Kg = 0;
    const ch4Kg = 0;
    const n2oKg = 0;

    if (input.mode === 'flight') {
      const haul = classifyFlightHaul(distanceMiles);
      co2Kg = distanceMiles * FLIGHT_CO2_KG_PER_PASSENGER_MILE[haul];
      return co2Kg + ch4Kg + n2oKg;
    }

    // rail / taxi / bus
    co2Kg = distanceKm * RAIL_LIKE_CO2_KG_PER_PASSENGER_KM;
    return co2Kg + ch4Kg + n2oKg;
  }
}

function classifyFlightHaul(distanceMiles: number): FlightHaul {
  if (distanceMiles < SHORT_HAUL_MAX_MILES) return 'short';
  if (distanceMiles <= MEDIUM_HAUL_MAX_MILES) return 'medium';
  return 'long';
}

function assertTransportInput(input: TransportInput): void {
  if (!input || typeof input !== 'object') {
    throw new Error('input must be an object');
  }

  if (
    !('mode' in input) ||
    (input.mode !== 'flight' &&
      input.mode !== 'rail' &&
      input.mode !== 'taxi' &&
      input.mode !== 'bus')
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    throw new Error(`Unsupported mode '${String((input as any).mode)}'`);
  }

  if (!('distance' in input) || !(input.distance instanceof Distance)) {
    throw new Error('distance must be a Distance value object');
  }
  if (input.distance.value <= 0) {
    throw new Error('distance must be > 0');
  }
}
