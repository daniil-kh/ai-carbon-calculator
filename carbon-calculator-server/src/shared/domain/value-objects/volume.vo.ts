import { VolumeUnit } from './volume.unit';

export class Volume {
  private constructor(
    public readonly value: number,
    public readonly unit: VolumeUnit,
  ) {}

  static of(value: number, unit: VolumeUnit): Volume {
    Volume.assertFiniteNumber(value, 'value');
    return new Volume(value, unit);
  }

  to(unit: VolumeUnit): Volume {
    if (unit === this.unit) return this;
    return new Volume(this.unit.convert(this.value, unit), unit);
  }

  private static assertFiniteNumber(value: number, name: string): void {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new Error(`${name} must be a finite number`);
    }
  }
}
