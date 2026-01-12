/**
 * General unit of measure.
 *
 * `conversionFactor` is a multiplier to convert a value in this unit into the
 * base unit for the same dimension (e.g., for Mass: base=kg, t => 1000).
 */
export abstract class Unit {
  protected constructor(
    public readonly symbol: string,
    public readonly conversionFactor: number,
  ) {
    if (!symbol) throw new Error('symbol is required');
    if (
      typeof conversionFactor !== 'number' ||
      !Number.isFinite(conversionFactor) ||
      conversionFactor <= 0
    ) {
      throw new Error('conversionFactor must be a positive finite number');
    }
  }

  convert(value: number, to: Unit): number {
    Unit.assertFiniteNumber(value, 'value');
    this.assertSameDimension(to);
    return to.fromBase(this.toBase(value));
  }

  protected toBase(value: number): number {
    return value * this.conversionFactor;
  }

  protected fromBase(value: number): number {
    return value / this.conversionFactor;
  }

  protected assertSameDimension(to: Unit): void {
    // By design: each dimension is represented by its own subclass.
    if (this.constructor !== to.constructor) {
      throw new Error(
        `Incompatible unit conversion: ${this.symbol} -> ${to.symbol}`,
      );
    }
  }

  protected static assertFiniteNumber(value: number, name: string): void {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new Error(`${name} must be a finite number`);
    }
  }
}
