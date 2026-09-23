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
