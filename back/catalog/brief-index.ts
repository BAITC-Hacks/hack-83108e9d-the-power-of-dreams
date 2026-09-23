import { createHash } from 'node:crypto';
import source from './brief-index.json' with { type: 'json' };
import { BRIEF_TRAITS } from '../../contracts/brief.ts';
import type { BriefIndex, TraitAssertion } from '../../contracts/brief.ts';
import type { Profile } from '../domain/types.ts';

export const BRIEF_INDEX_VERSION = 'catalog-brief-v1';
export class BriefIndexError extends Error {
  constructor() { super('Catalogue brief evidence is unavailable.'); this.name = 'BriefIndexError'; }
}
const object = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value);
function requireIndex(condition: unknown): asserts condition { if (!condition) throw new BriefIndexError(); }
const exact = (value: Record<string, unknown>, keys: readonly string[]) =>
  Object.keys(value).length === keys.length && keys.every(key => Object.hasOwn(value, key));

/** Validate the complete catalogue before any eligible subset is ranked. No partial index. */
export function loadBriefIndex(profiles: readonly Profile[], raw: unknown = source): BriefIndex {
  requireIndex(object(raw) && exact(raw, ['version', 'profiles']));
  requireIndex(raw.version === BRIEF_INDEX_VERSION && Array.isArray(raw.profiles));
  requireIndex(raw.profiles.length === profiles.length && profiles.length > 0);
  const profilesById = new Map(profiles.map(profile => [profile.id, profile]));
  requireIndex(profilesById.size === profiles.length);
  const byId: Record<string, readonly TraitAssertion[]> = Object.create(null);
  for (const row of raw.profiles) {
    requireIndex(object(row) && exact(row, ['id', 'descriptionHash', 'assertions']));
    requireIndex(typeof row.id === 'string' && !Object.hasOwn(byId, row.id));
    const profile = profilesById.get(row.id);
    requireIndex(profile !== undefined);
    requireIndex(row.descriptionHash === `sha256:${createHash('sha256').update(profile.description, 'utf8').digest('hex')}`);
    requireIndex(Array.isArray(row.assertions));
    const traits = new Set<string>();
    const assertions: TraitAssertion[] = [];
    for (const assertion of row.assertions) {
      requireIndex(object(assertion) && exact(assertion, ['trait', 'value', 'quote']));
      requireIndex(typeof assertion.trait === 'string' && Object.hasOwn(BRIEF_TRAITS, assertion.trait) && !traits.has(assertion.trait));
      requireIndex(typeof assertion.value === 'boolean');
      requireIndex(typeof assertion.quote === 'string' && assertion.quote.trim().length > 0 && [...assertion.quote].length <= 240);
      requireIndex(profile.description.includes(assertion.quote));
      traits.add(assertion.trait);
      assertions.push(Object.freeze({ trait: assertion.trait as TraitAssertion['trait'], value: assertion.value, quote: assertion.quote }));
    }
    byId[row.id] = Object.freeze(assertions);
  }
  return Object.freeze({ version: BRIEF_INDEX_VERSION, byId: Object.freeze(byId) });
}
