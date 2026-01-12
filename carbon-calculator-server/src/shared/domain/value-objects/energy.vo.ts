import { EnergyUnit } from './energy.unit';

export class Energy {
  private constructor(
    public readonly value: number,
    public readonly unit: EnergyUnit,
  ) {}

  static of(value: number, unit: EnergyUnit): Energy {
    Energy.assertFiniteNumber(value, 'value');
    return new Energy(value, unit);
  }

  to(unit: EnergyUnit): Energy {
    if (unit === this.unit) return this;
    return new Energy(this.unit.convert(this.value, unit), unit);
  }

  private static assertFiniteNumber(value: number, name: string): void {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new Error(`${name} must be a finite number`);
    }
  }
}

