import { Unit } from './unit';

export class EnergyUnit extends Unit {
  static readonly KWH = new EnergyUnit('kWh', 1);
  static readonly MWH = new EnergyUnit('MWh', 1000);
  // 1 GJ = 277.777... kWh
  static readonly GJ = new EnergyUnit('GJ', 277.77777777777777);

  private constructor(symbol: string, conversionFactor: number) {
    super(symbol, conversionFactor);
  }
}
