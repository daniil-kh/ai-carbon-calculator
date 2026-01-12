import { MassUnit } from './mass.unit';

export class Mass {
  private constructor(
    public readonly value: number,
    public readonly unit: MassUnit,
  ) {}

  static of(value: number, unit: MassUnit): Mass {
    Mass.assertFiniteNumber(value, 'value');
    return new Mass(value, unit);
  }

  to(unit: MassUnit): Mass {
    if (unit === this.unit) return this;
    return new Mass(this.unit.convert(this.value, unit), unit);
  }

  private static assertFiniteNumber(value: number, name: string): void {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new Error(`${name} must be a finite number`);
    }
  }
}
