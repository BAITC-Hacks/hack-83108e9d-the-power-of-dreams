import type { CatalogOptions, ErrorCode, NormalizedRequest, RequestField } from '../../contracts/contractor-selection.ts';
import { isCalendarDate } from '../domain/date.ts';
export class InputError extends Error {
  readonly code: ErrorCode;
  readonly field: RequestField | undefined;
  constructor(code: ErrorCode, field?: RequestField) { super('Invalid request'); this.code = code; this.field = field; }
}
export function normalize(value: unknown, options: CatalogOptions): NormalizedRequest {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new InputError('INVALID_REQUEST');
  const input = value as Record<string, unknown>;
  const keys = ['city', 'date', 'eventFormat', 'category', 'budgetKzt', 'language', 'durationHours'];
  if (Object.keys(input).some(k => !keys.includes(k))) throw new InputError('INVALID_REQUEST');
  const string = (field: RequestField) => {
    if (typeof input[field] !== 'string' || !(input[field] as string).trim()) throw new InputError('INVALID_REQUEST', field);
    return (input[field] as string).trim();
  };
  const option = (field: RequestField, values: readonly string[]) => {
    const text = string(field).toLowerCase();
    const found = values.find(v => v.toLowerCase() === text);
    if (!found) throw new InputError('INVALID_REQUEST', field);
    return found;
  };
  const date = string('date');
  if (!isCalendarDate(date)) throw new InputError('INVALID_REQUEST', 'date');
  if (date < options.dateWindow.min || date > options.dateWindow.max) throw new InputError('DATE_OUT_OF_RANGE', 'date');
  if (typeof input.budgetKzt !== 'number' || !Number.isSafeInteger(input.budgetKzt) || input.budgetKzt <= 0) throw new InputError('INVALID_REQUEST', 'budgetKzt');
  const request: NormalizedRequest = { city: option('city', options.cities), category: option('category', options.categories),
    eventFormat: option('eventFormat', options.eventFormats), date, budgetKzt: input.budgetKzt,
    ...(Object.hasOwn(input, 'language') ? { language: option('language', options.languages) } : {}) };
  if (Object.hasOwn(input, 'durationHours')) {
    if (typeof input.durationHours !== 'number' || !Number.isFinite(input.durationHours) || input.durationHours <= 0) throw new InputError('INVALID_REQUEST', 'durationHours');
    return { ...request, durationHours: input.durationHours };
  }
  return request;
}
