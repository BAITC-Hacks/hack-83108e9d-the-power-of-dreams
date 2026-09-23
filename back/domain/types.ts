import type {
  CatalogOptions, NormalizedRequest, Outcome, QualityFlags, SelectionSummary,
} from '../../contracts/contractor-selection.ts';

export type Profile = {
  readonly id: string;
  readonly name: string;
  readonly categories: readonly string[];
  readonly city: string;
  readonly priceFromKzt: number;
  readonly eventFormats: readonly string[];
  readonly languages: readonly string[];
  /** null means presence duration is inapplicable, not unlimited. */
  readonly maxHours: number | null;
  readonly busyDates: readonly string[];
  readonly description: string;
  readonly qualityFlags: QualityFlags;
};
export type CatalogSnapshot = {
  readonly profiles: readonly Profile[];
  readonly options: CatalogOptions;
  readonly catalogVersion: string;
};
export type CatalogFailure = { readonly kind: 'missing' | 'unreadable' | 'invalid' };
export type CatalogLoadResult =
  | { readonly status: 'ready'; readonly snapshot: CatalogSnapshot }
  | { readonly status: 'unavailable'; readonly error: CatalogFailure };
/** One read, no retries. Unexpected faults reject; composition retains the result. */
export type LoadCatalog = (path: string) => Promise<CatalogLoadResult>;
export type SelectionResult = {
  readonly outcome: Outcome;
  readonly selectedIds: readonly string[];
  readonly summary: SelectionSummary;
};
/** Pure operation: no I/O or mutation; price ascending, then fixed string ID. */
export type Select = (profiles: readonly Profile[], request: NormalizedRequest) => SelectionResult;
