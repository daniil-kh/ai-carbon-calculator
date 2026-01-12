import { Unit } from './unit';

export class DistanceUnit extends Unit {
  /**
   * Base unit: kilometers
   */
  static readonly KM = new DistanceUnit('km', 1);

  /**
   * Miles to kilometers conversion:
   * 1 mile = 1.609344 km
   */
  static readonly MILE = new DistanceUnit('mile', 1.609344);

  private constructor(symbol: string, conversionFactor: number) {
    super(symbol, conversionFactor);
  }
}

