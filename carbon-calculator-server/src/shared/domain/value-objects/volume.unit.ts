import { Unit } from './unit';

export class VolumeUnit extends Unit {
  static readonly L = new VolumeUnit('l', 1);
  static readonly M3 = new VolumeUnit('m3', 1000);

  private constructor(symbol: string, conversionFactor: number) {
    super(symbol, conversionFactor);
  }
}
