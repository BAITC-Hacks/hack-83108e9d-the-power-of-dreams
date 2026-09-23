import type { CatalogSnapshot, Select } from '../domain/types.ts';
import type { Recommend, SelectEvidence, SelectBrief } from './ports.ts';
const money = (n: number) => new Intl.NumberFormat('ru-RU').format(n);
const active = (signal: AbortSignal) => { if (signal.aborted) throw new DOMException('Request cancelled', 'AbortError'); };
export function createRecommend(snapshot: CatalogSnapshot, select: Select, evidence: SelectEvidence, selectBrief?: SelectBrief): Recommend {
  return async (request, signal) => {
    active(signal);
    const personalized = request.brief?.conditions.length ? selectBrief?.(request) : undefined;
    if (request.brief?.conditions.length && !personalized) throw Object.assign(new Error('Brief index unavailable'), { code: 'BRIEF_INDEX_UNAVAILABLE' });
    const selection = personalized?.selection ?? select(snapshot.profiles, request);
    const selected = selection.selectedIds.map(id => snapshot.profiles.find(p => p.id === id)!);
    const result = selected.length && !personalized ? await evidence(request, selected.map(p => ({ id: p.id, description: p.description,
      eventFormats: p.eventFormats, priceFromKzt: p.priceFromKzt, languages: p.languages, maxHours: p.maxHours })), signal) : undefined;
    active(signal);
    let quotes = 0;
    const cards = selected.map(p => {
      const item = result?.status === 'validated' ? result.byId[p.id] : undefined;
      let explanation = `Поддерживает формат «${request.eventFormat}»; стартовая цена ${money(p.priceFromKzt)} ₸ укладывается в бюджет ${money(request.budgetKzt)} ₸.`;
      if (item?.status === 'accepted') { quotes++; explanation += ` Из описания: «${item.quote.replace(/[.!?…]+$/u, '')}».`; }
      const briefMatch = personalized?.matches.find(m => m.id === p.id);
      const advice = briefMatch?.advice;
      if (advice) {
        const matched = advice.evidence.find(e => e.relation === 'match');
        const quote = briefMatch?.profileExcerpt?.replace(/[.!?…]+$/u, '');
        explanation += quote ? ` Из анкеты: «${quote}»${matched ? '.' : '; соответствие пожеланиям нужно уточнить.'}`
          : 'Подтверждения соответствия пожеланиям в анкете нет; детали нужно уточнить.';
      }
      return { id: p.id, name: p.name, category: request.category, city: p.city, priceFromKzt: p.priceFromKzt, explanation, qualityFlags: p.qualityFlags,
        ...(advice ? { briefAdvice: advice } : {}) };
    });
    return { normalizedRequest: request, context: { catalogVersion: snapshot.catalogVersion, selectionPolicyVersion: personalized?.policyVersion ?? 'selection-v1' },
      outcome: selection.outcome, summary: selection.summary, cards,
      explanationMode: !cards.length ? 'not_needed' : personalized ? 'brief_evidence' : quotes === cards.length ? 'openai_evidence' : quotes ? 'mixed' : 'catalog_fallback' };
  };
}
