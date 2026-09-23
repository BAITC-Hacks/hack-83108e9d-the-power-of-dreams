/** Public JSON contract v1. Runtime validation belongs to the HTTP boundary. */
export type RecommendationRequest = {
  readonly city: string;
  readonly date: string;
  readonly eventFormat: string;
  readonly category: string;
  readonly budgetKzt: number;
  readonly language?: string;
  readonly durationHours?: number;
};

export type NormalizedRequest = RecommendationRequest;
export type ComparisonContext = {
  readonly catalogVersion: string;
  readonly selectionPolicyVersion: string;
};
export type CatalogOptions = {
  readonly cities: readonly string[];
  readonly categories: readonly string[];
  readonly eventFormats: readonly string[];
  readonly languages: readonly string[];
  readonly dateWindow: { readonly min: string; readonly max: string };
};
export type CatalogOptionsResponse = {
  readonly requestId: string;
  readonly context: ComparisonContext;
  readonly options: CatalogOptions;
};
export type QualityFlags = {
  readonly synthetic: boolean;
  readonly cityImputed: boolean;
  readonly priceImputed: boolean;
};
export type RecommendationCard = {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly city: string;
  readonly priceFromKzt: number;
  readonly explanation: string;
  readonly qualityFlags: QualityFlags;
};
export type SelectionSummary = {
  readonly candidateCount: number;
  readonly eligibleCount: number;
  readonly exclusions: {
    readonly busy: number;
    readonly budget: number;
    readonly format: number;
    readonly language: number;
    readonly duration: number;
  };
  readonly busyProfileIds: readonly string[];
};
export type Outcome = 'matched' | 'category_absent' | 'no_match';
export type ExplanationMode = 'openai_evidence' | 'mixed' | 'catalog_fallback' | 'not_needed';
export type RecommendationResponse = {
  readonly requestId: string;
  readonly normalizedRequest: NormalizedRequest;
  readonly context: ComparisonContext;
  readonly outcome: Outcome;
  readonly cards: readonly RecommendationCard[];
  readonly summary: SelectionSummary;
  readonly explanationMode: ExplanationMode;
};
export type RequestField = keyof RecommendationRequest;
export type ErrorCode = 'INVALID_REQUEST' | 'DATE_OUT_OF_RANGE' | 'CATALOG_UNAVAILABLE' | 'INTERNAL_ERROR';
export type ErrorResponse = {
  readonly error: {
    readonly code: ErrorCode;
    readonly message: string;
    readonly requestId: string;
    readonly fields?: readonly { readonly field: RequestField; readonly message: string }[];
  };
};
