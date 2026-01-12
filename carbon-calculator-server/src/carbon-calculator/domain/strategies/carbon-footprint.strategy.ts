export type CarbonFootprintStrategyKind =
  | 'StationaryCombustion'
  | 'PurchasedEnergy'
  | 'FugitiveEmissions'
  | 'Transport'
  | 'MaterialLifecycle';

/**
 * Domain contract for carbon footprint calculation strategies.
 *
 * NOTE: Input/output shapes are intentionally minimal for now
 * (you requested file structure only).
 */
export interface CarbonFootprintStrategy {
  readonly kind: CarbonFootprintStrategyKind;
  calculate(input: unknown): number;
}
