import type { CatalogOptionsResponse, RecommendationResponse } from '../contracts/contractor-selection';

const object = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
const text = (value: unknown): value is string => typeof value === 'string' && value.length > 0;
const strings = (value: unknown): value is string[] => Array.isArray(value) && value.every(text);
const count = (value: unknown): value is number => typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
const positive = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value > 0;
const date = (value: unknown): value is string => text(value) && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
const context = (value: unknown) => object(value) && text(value.catalogVersion) && text(value.selectionPolicyVersion);

export function isOptionsResponse(value: unknown): value is CatalogOptionsResponse {
  if (!object(value) || !text(value.requestId) || !context(value.context) || !object(value.options)) return false;
  const options = value.options;
  return [options.cities, options.categories, options.eventFormats].every(items => strings(items) && items.length > 0) &&
    strings(options.languages) && object(options.dateWindow) && date(options.dateWindow.min) && date(options.dateWindow.max) && options.dateWindow.min <= options.dateWindow.max;
}

export function isRecommendationResponse(value: unknown): value is RecommendationResponse {
  if (!object(value) || !text(value.requestId) || !context(value.context) || !object(value.normalizedRequest) || !object(value.summary) || !Array.isArray(value.cards)) return false;
  const request = value.normalizedRequest;
  if (![request.city, request.eventFormat, request.category].every(text) || !date(request.date) || !positive(request.budgetKzt) || !Number.isSafeInteger(request.budgetKzt) ||
    (request.language !== undefined && !text(request.language)) || (request.durationHours !== undefined && !positive(request.durationHours))) return false;
  const summary = value.summary;
  if (!count(summary.candidateCount) || !count(summary.eligibleCount) || summary.eligibleCount > summary.candidateCount ||
    !strings(summary.busyProfileIds) || !object(summary.exclusions) || !['busy', 'budget', 'format', 'language', 'duration'].every(key => count((summary.exclusions as Record<string, unknown>)[key]))) return false;
  if (!['matched', 'category_absent', 'no_match'].includes(String(value.outcome)) || !['openai_evidence', 'mixed', 'catalog_fallback', 'not_needed'].includes(String(value.explanationMode))) return false;
  if (value.outcome === 'matched' ? value.cards.length < 1 || value.cards.length > 3 || value.cards.length > summary.eligibleCount || value.explanationMode === 'not_needed' : value.cards.length !== 0 || summary.eligibleCount !== 0 || value.explanationMode !== 'not_needed') return false;
  return value.cards.every(card => object(card) && [card.id, card.name, card.category, card.city, card.explanation].every(text) && positive(card.priceFromKzt) &&
    object(card.qualityFlags) && ['synthetic', 'cityImputed', 'priceImputed'].every(key => typeof (card.qualityFlags as Record<string, unknown>)[key] === 'boolean'));
}

export function publicError(value: unknown): { code: string; requestId: string; fields: string[] } | undefined {
  if (!object(value) || !object(value.error)) return undefined;
  const error = value.error;
  return { code: typeof error.code === 'string' ? error.code : '',
    requestId: typeof error.requestId === 'string' && /^[\w-]{1,100}$/.test(error.requestId) ? error.requestId : '',
    fields: Array.isArray(error.fields) ? error.fields.flatMap(field => object(field) && typeof field.field === 'string' ? [field.field] : []) : [] };
}
