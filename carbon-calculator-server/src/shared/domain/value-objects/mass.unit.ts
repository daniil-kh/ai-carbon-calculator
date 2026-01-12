import { Unit } from './unit';

export class MassUnit extends Unit {
  static readonly KG = new MassUnit('kg', 1);
  static readonly T = new MassUnit('t', 1000);

  private constructor(symbol: string, conversionFactor: number) {
    super(symbol, conversionFactor);
  }
}
