import type { Select } from './types.ts';
export const select: Select = (profiles, request) => {
  const candidates = profiles.filter(p => p.city === request.city && p.categories.includes(request.category));
  const exclusions = { busy: 0, budget: 0, format: 0, language: 0, duration: 0 };
  const busyProfileIds = candidates.filter(p => p.busyDates.includes(request.date)).map(p => p.id).sort();
  const eligible = candidates.filter(p => {
    const reason = p.busyDates.includes(request.date) ? 'busy' : p.priceFromKzt > request.budgetKzt ? 'budget'
      : !p.eventFormats.includes(request.eventFormat) ? 'format'
      : request.language !== undefined && !p.languages.includes(request.language) ? 'language'
      : request.durationHours !== undefined && p.maxHours !== null && request.durationHours > p.maxHours ? 'duration' : undefined;
    if (reason) { exclusions[reason]++; return false; }
    return true;
  }).sort((a, b) => a.priceFromKzt - b.priceFromKzt || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  return { outcome: !candidates.length ? 'category_absent' : !eligible.length ? 'no_match' : 'matched',
    selectedIds: eligible.slice(0, 3).map(p => p.id),
    summary: { candidateCount: candidates.length, eligibleCount: eligible.length, exclusions, busyProfileIds } };
};
