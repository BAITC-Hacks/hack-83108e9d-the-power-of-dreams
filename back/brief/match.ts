import type { BriefAdvice, BriefIndex, BriefMatch, ConfirmedBrief } from '../../contracts/brief.ts';
import type { Profile } from '../domain/types.ts';

/** Pure soft ranking: callers supply all hard-eligible profiles and truncate afterwards. */
export function matchBrief(profiles: readonly Profile[], brief: ConfirmedBrief, index: BriefIndex): readonly BriefMatch[] {
  return profiles.map(profile => {
    const evidence: BriefAdvice['evidence'][number][] = [];
    const unknownConditions: BriefAdvice['unknownConditions'][number][] = [];
    for (const condition of brief.conditions) {
      const assertion = condition.trait === null ? undefined : index.byId[profile.id]?.find(a => a.trait === condition.trait);
      if (!assertion) { unknownConditions.push(condition); continue; }
      evidence.push({ condition, relation: assertion.value === (condition.intent === 'prefer') ? 'match' : 'conflict', quote: assertion.quote });
    }
    evidence.sort((a, b) => Number(a.relation === 'match') - Number(b.relation === 'match'));
    const ask = unknownConditions.find(c => c.intent === 'avoid') ?? unknownConditions[0] ?? evidence.find(e => e.relation === 'conflict')?.condition;
    const profileExcerpt = evidence.find(e => e.relation === 'match')?.quote ?? index.byId[profile.id]?.[0]?.quote;
    return { id: profile.id, price: profile.priceFromKzt, ...(profileExcerpt ? { profileExcerpt } : {}),
      conflicts: evidence.filter(e => e.relation === 'conflict').length,
      matches: evidence.filter(e => e.relation === 'match').length,
      advice: { evidence, unknownConditions, question: ask
        ? `Сможете ли вы учесть пожелание «${ask.text}»?`
        : 'Подтвердите с подрядчиком окончательные условия и состав услуг.' } };
  }).sort((a, b) => a.conflicts - b.conflicts || b.matches - a.matches || a.price - b.price || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
    .map(({ price: _price, ...match }) => match);
}
