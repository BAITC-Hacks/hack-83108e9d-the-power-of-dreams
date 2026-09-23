import { fixtures } from './fixtures.ts';
import type { CatalogLoadResult } from '../../back/domain/types.ts';
import type { EvidenceResult, QuoteFailure } from '../../back/recommend/ports.ts';
import type { NormalizedRequest } from '../contractor-selection.ts';

/** Case definitions for later consumers, not executed normalization/AI behavior. */
export const normalization = {
  input: { city: '  алматы ', date: ' 2026-10-10 ', eventFormat: ' КОРПОРАТИВ ', category: ' ведущий ', budgetKzt: 1500000 },
  expected: fixtures.request,
} as const satisfies { input: NormalizedRequest; expected: NormalizedRequest };
export const withOptionalInputs = {
  ...fixtures.request, language: 'русский', durationHours: 4,
} as const satisfies NormalizedRequest;

export const catalogFailures = [
  { status: 'unavailable', error: { kind: 'missing' } },
  { status: 'unavailable', error: { kind: 'unreadable' } },
  { status: 'unavailable', error: { kind: 'invalid' } },
] as const satisfies readonly CatalogLoadResult[];

const items = fixtures.moduleBoundaries.providerEnvelope.items;
const unavailable = { status: 'unavailable', reason: 'invalid_batch' } as const;
export const identityCases = [
  { name: 'reversed', items: [items[2], items[1], items[0]], expected: {
    status: 'validated', byId: {
      'FX-001': { status: 'accepted', quote: items[0].evidenceQuote },
      'FX-002': { status: 'accepted', quote: items[1].evidenceQuote },
      'FX-003': { status: 'accepted', quote: items[2].evidenceQuote },
    },
  } },
  { name: 'duplicate', items: [items[0], items[0], items[2]], expected: unavailable },
  { name: 'missing', items: [items[0], items[1]], expected: unavailable },
  { name: 'unknown', items: [items[0], items[1], { id: 'FX-999', evidenceQuote: 'Unknown' }], expected: unavailable },
] as const satisfies readonly { name: string; items: readonly { id: string; evidenceQuote: string | null }[]; expected: EvidenceResult }[];

export const quoteCases = [
  { quote: null, reason: 'no_quote' },
  { quote: '  \n ', reason: 'blank' },
  { quote: 'А'.repeat(181), reason: 'too_long' },
  { quote: 'Первое предложение. Второе предложение.', reason: 'multiple_sentences' },
  { quote: 'Этого нет в исходном описании', reason: 'source_mismatch' },
] as const satisfies readonly { quote: string | null; reason: QuoteFailure }[];

export const perCardCases = quoteCases.map(({ quote, reason }) => ({
  providerEnvelope: { items: [items[0], items[1], { id: 'FX-003', evidenceQuote: quote }] },
  expected: {
    status: 'validated', byId: {
      'FX-001': { status: 'accepted', quote: items[0].evidenceQuote },
      'FX-002': { status: 'accepted', quote: items[1].evidenceQuote },
      'FX-003': { status: 'fallback', reason },
    },
  } satisfies EvidenceResult,
}));

export const cancellation = { signalState: 'aborted', expectedRejectionName: 'AbortError', expectedRetries: 0, expectedFallback: false } as const;
export const activeTimeout = { expected: { status: 'unavailable', reason: 'timeout' }, expectedRetries: 0 } as const satisfies { expected: EvidenceResult; expectedRetries: number };

/** Same context and non-date inputs. Small controlled comparison snapshots. */
export const dateComparisonCases = [
  { name: 'becomes busy', oldIds: ['FX-001'], newIds: ['FX-002'], oldBusy: ['FX-002'], newBusy: ['FX-001'], expected: 'FX-001 became busy; FX-002 became available' },
  { name: 'price displacement', oldIds: ['FX-002'], newIds: ['FX-001'], oldBusy: ['FX-001'], newBusy: [], prices: { 'FX-001': 100000, 'FX-002': 200000 }, expected: 'FX-002 remains available; cheaper FX-001 became available' },
  { name: 'equal price ID tie', oldIds: ['FX-002'], newIds: ['FX-001'], oldBusy: ['FX-001'], newBusy: [], prices: { 'FX-001': 100000, 'FX-002': 100000 }, expected: 'FX-002 remains available; FX-001 wins the ID tie, not cheaper' },
  { name: 'already available promotion', oldIds: ['FX-001'], newIds: ['FX-002'], oldBusy: [], newBusy: ['FX-001'], expected: 'FX-002 was already available and was promoted' },
] as const;
