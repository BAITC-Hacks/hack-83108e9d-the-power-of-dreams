import type { NormalizedRequest, RecommendationResponse } from '../../contracts/contractor-selection.ts';

/** The evidence adapter gets only selected profiles; no complete calendars. */
export type EvidenceProfile = {
  readonly id: string;
  readonly description: string;
  readonly eventFormats: readonly string[];
  readonly priceFromKzt: number;
  readonly languages: readonly string[];
  readonly maxHours: number | null;
};
export type QuoteFailure = 'no_quote' | 'blank' | 'too_long' | 'multiple_sentences' | 'source_mismatch';
export type EvidenceItem =
  | { readonly status: 'accepted'; readonly quote: string }
  | { readonly status: 'fallback'; readonly reason: QuoteFailure };
export type EvidenceResult =
  | { readonly status: 'validated'; readonly byId: Readonly<Record<string, EvidenceItem>> }
  | { readonly status: 'unavailable'; readonly reason: 'configuration' | 'timeout' | 'provider' | 'invalid_response' | 'invalid_batch' };
/** Exact selected ID mapping; one 6s deadline including body, no retries.
 * Caller cancellation rejects AbortError and must not produce fallback work.
 */
export type SelectEvidence = (
  request: NormalizedRequest,
  selectedProfiles: readonly EvidenceProfile[],
  signal: AbortSignal,
) => Promise<EvidenceResult>;
export type RecommendationResult = Omit<RecommendationResponse, 'requestId'>;
/** Inject ready snapshot, pure selection and evidence; HTTP attaches requestId. */
export type Recommend = (request: NormalizedRequest, signal: AbortSignal) => Promise<RecommendationResult>;
