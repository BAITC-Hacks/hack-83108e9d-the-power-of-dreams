/** Public, provider-independent brief contract. Only explicit profile claims count. */
export const BRIEF_VOCABULARY_VERSION = 'brief-v1' as const;
export const BRIEF_TRAITS = {
  discreet: 'Ненавязчивая подача',
  energetic: 'Энергичная программа',
  humor: 'Юмор',
  dancing: 'Танцы',
  contests: 'Конкурсы',
  traditional: 'Национальные традиции',
  business: 'Деловая подача',
  interactive: 'Интерактив с гостями',
  live_music: 'Живая музыка',
  classical: 'Классическая музыка',
  reportage: 'Репортажная съёмка',
  posed: 'Постановочная съёмка',
  cinematic: 'Кинематографичная съёмка',
  outdoors: 'Работа на открытом воздухе',
  minimalist: 'Минималистичное оформление',
  floral: 'Цветочное оформление',
  children: 'Программа для детей',
  equipment: 'Своё техническое оборудование',
} as const;
export type TraitId = keyof typeof BRIEF_TRAITS;
export type BriefCondition = {
  readonly trait: TraitId | null;
  readonly intent: 'prefer' | 'avoid';
  /** Literal span of the brief; preserves negative wording. */
  readonly text: string;
};
export type ConfirmedBrief = {
  readonly vocabularyVersion: typeof BRIEF_VOCABULARY_VERSION;
  readonly text: string;
  readonly conditions: readonly BriefCondition[];
};
export type InterpretBriefRequest = { readonly text: string };
export type InterpretBriefResponse = { readonly requestId: string; readonly brief: ConfirmedBrief };
export type BriefAdvice = {
  readonly evidence: readonly { readonly condition: BriefCondition; readonly relation: 'match' | 'conflict'; readonly quote: string }[];
  readonly unknownConditions: readonly BriefCondition[];
  readonly question: string;
};
export type TraitAssertion = { readonly trait: TraitId; readonly value: boolean; readonly quote: string };
/** Plain validated data passed to the pure matcher, never an adapter instance. */
export type BriefIndex = { readonly version: string; readonly byId: Readonly<Record<string, readonly TraitAssertion[]>> };
export type BriefMatch = { readonly id: string; readonly conflicts: number; readonly matches: number; readonly advice: BriefAdvice; readonly profileExcerpt?: string };

export const normalizeBriefText = (text: string) => text.replace(/\s+/gu, ' ').trim();
const object = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);
const exact = (value: Record<string, unknown>, keys: string[]) => Object.keys(value).length === keys.length && keys.every(key => Object.hasOwn(value, key));
const bounded = (value: unknown, max: number): value is string => typeof value === 'string' && value.trim().length > 0 && [...value].length <= max;
export function isBriefCondition(value: unknown): value is BriefCondition {
  return object(value) && exact(value, ['trait', 'intent', 'text']) &&
    (value.trait === null || (typeof value.trait === 'string' && Object.hasOwn(BRIEF_TRAITS, value.trait))) &&
    (value.intent === 'prefer' || value.intent === 'avoid') && bounded(value.text, 160);
}
export function isConfirmedBrief(value: unknown): value is ConfirmedBrief {
  if (!object(value) || !exact(value, ['vocabularyVersion', 'text', 'conditions']) ||
      value.vocabularyVersion !== BRIEF_VOCABULARY_VERSION || !bounded(value.text, 1000) ||
      !Array.isArray(value.conditions) || value.conditions.length > 6) return false;
  const source = normalizeBriefText(value.text);
  const traits = new Set<string>();
  const texts = new Set<string>();
  for (const condition of value.conditions) {
    if (!isBriefCondition(condition)) return false;
    const text = normalizeBriefText(condition.text);
    if (!source.includes(text) || texts.has(text) || (condition.trait !== null && traits.has(condition.trait))) return false;
    texts.add(text); if (condition.trait !== null) traits.add(condition.trait);
  }
  return true;
}
export function canonicalBrief(brief: ConfirmedBrief): ConfirmedBrief {
  return { vocabularyVersion: BRIEF_VOCABULARY_VERSION, text: normalizeBriefText(brief.text),
    conditions: brief.conditions.map(c => ({ trait: c.trait, intent: c.intent, text: normalizeBriefText(c.text) })) };
}
export function isBriefAdvice(value: unknown): value is BriefAdvice {
  return object(value) && exact(value, ['evidence', 'unknownConditions', 'question']) &&
    Array.isArray(value.evidence) && Array.isArray(value.unknownConditions) &&
    value.evidence.length + value.unknownConditions.length <= 6 && bounded(value.question, 400) &&
    value.unknownConditions.every(isBriefCondition) && value.evidence.every(item => object(item) &&
      exact(item, ['condition', 'relation', 'quote']) && isBriefCondition(item.condition) &&
      (item.relation === 'match' || item.relation === 'conflict') && bounded(item.quote, 240));
}
