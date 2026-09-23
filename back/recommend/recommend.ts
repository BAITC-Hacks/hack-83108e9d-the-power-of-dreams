import type { CatalogSnapshot, Select } from '../domain/types.ts';
import type { Recommend, SelectEvidence } from './ports.ts';
const money = (n: number) => new Intl.NumberFormat('ru-RU').format(n);
const active = (signal: AbortSignal) => { if (signal.aborted) throw new DOMException('Request cancelled', 'AbortError'); };
export function createRecommend(snapshot: CatalogSnapshot, select: Select, evidence: SelectEvidence): Recommend {
  return async (request, signal) => {
    active(signal);
    const selection = select(snapshot.profiles, request);
    const selected = selection.selectedIds.map(id => snapshot.profiles.find(p => p.id === id)!);
    const result = selected.length ? await evidence(request, selected.map(p => ({ id: p.id, description: p.description,
      eventFormats: p.eventFormats, priceFromKzt: p.priceFromKzt, languages: p.languages, maxHours: p.maxHours })), signal) : undefined;
    active(signal);
    let quotes = 0;
    const cards = selected.map(p => {
      const item = result?.status === 'validated' ? result.byId[p.id] : undefined;
      let explanation = `Поддерживает формат «${request.eventFormat}»; стартовая цена ${money(p.priceFromKzt)} ₸ укладывается в бюджет ${money(request.budgetKzt)} ₸.`;
      if (item?.status === 'accepted') { quotes++; explanation += ` Из описания: «${item.quote.replace(/[.!?…]+$/u, '')}».`; }
      return { id: p.id, name: p.name, category: request.category, city: p.city, priceFromKzt: p.priceFromKzt, explanation, qualityFlags: p.qualityFlags };
    });
    return { normalizedRequest: request, context: { catalogVersion: snapshot.catalogVersion, selectionPolicyVersion: 'selection-v1' },
      outcome: selection.outcome, summary: selection.summary, cards,
      explanationMode: !cards.length ? 'not_needed' : quotes === cards.length ? 'openai_evidence' : quotes ? 'mixed' : 'catalog_fallback' };
  };
}
