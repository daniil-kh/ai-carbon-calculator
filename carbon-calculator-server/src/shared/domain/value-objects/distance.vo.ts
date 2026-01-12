import { DistanceUnit } from './distance.unit';

export class Distance {
  private constructor(
    public readonly value: number,
    public readonly unit: DistanceUnit,
  ) {}

  static of(value: number, unit: DistanceUnit): Distance {
    Distance.assertFiniteNumber(value, 'value');
    return new Distance(value, unit);
  }

  to(unit: DistanceUnit): Distance {
    if (unit === this.unit) return this;
    return new Distance(this.unit.convert(this.value, unit), unit);
  }

  private static assertFiniteNumber(value: number, name: string): void {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new Error(`${name} must be a finite number`);
    }
  }
}

