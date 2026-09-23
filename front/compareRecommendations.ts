import type { RecommendationRequest, RecommendationResponse } from '../contracts/contractor-selection.ts';

export function requestKey(request: RecommendationRequest, includeDate = true): string {
  return JSON.stringify([request.city, includeDate ? request.date : '', request.eventFormat,
    request.category, request.budgetKzt, request.language ?? null, request.durationHours ?? null]);
}

/** Explain only identities and ordering evidenced by two comparable public responses. */
export function compareRecommendations(previous: RecommendationResponse | undefined, current: RecommendationResponse): string[] {
  if (!previous || previous.normalizedRequest.date === current.normalizedRequest.date ||
    requestKey(previous.normalizedRequest, false) !== requestKey(current.normalizedRequest, false) ||
    previous.context.catalogVersion !== current.context.catalogVersion ||
    previous.context.selectionPolicyVersion !== current.context.selectionPolicyVersion) return [];
  const dates = `${previous.normalizedRequest.date} → ${current.normalizedRequest.date}`;
  if (JSON.stringify(previous.cards.map(card => card.id)) === JSON.stringify(current.cards.map(card => card.id))) {
    return [`${dates}: отображаемый список не изменился.`];
  }
  const oldBusy = new Set(previous.summary.busyProfileIds);
  const newBusy = new Set(current.summary.busyProfileIds);
  const departed = previous.cards.filter(card => !current.cards.some(next => next.id === card.id));
  const entered = current.cards.filter(card => !previous.cards.some(old => old.id === card.id));
  const newlyAvailable = entered.filter(card => oldBusy.has(card.id) && !newBusy.has(card.id));
  const newlyBusy = departed.filter(card => newBusy.has(card.id));
  const facts = [`Изменение даты: ${dates}.`];
  for (const card of newlyBusy) facts.push(`${card.name} (${card.id}): появилась отметка занятости на ${current.normalizedRequest.date}.`);
  for (const card of newlyAvailable) facts.push(`${card.name} (${card.id}): на новой дате нет прежней отметки занятости; подрядчик вошёл в список по порядку стартовой цены и ID.`);
  for (const card of departed.filter(card => !newBusy.has(card.id))) {
    const ahead = newlyAvailable.filter(next => next.priceFromKzt < card.priceFromKzt ||
      (next.priceFromKzt === card.priceFromKzt && next.id < card.id));
    if (ahead.length) {
      const reason = ahead.some(next => next.priceFromKzt < card.priceFromKzt)
        ? 'впереди появились варианты дешевле по стартовой цене'
        : 'при равной стартовой цене впереди стоят меньшие ID каталога';
      facts.push(`${card.name} (${card.id}): отметки занятости нет, но подрядчик вышел из отображаемого списка — ${reason}.`);
    }
  }
  if (newlyBusy.length) for (const card of entered.filter(card => !oldBusy.has(card.id) && !newBusy.has(card.id))) {
    facts.push(`${card.name} (${card.id}): отметки занятости не было и на предыдущую дату; подрядчик поднялся в список после появления занятости у вариантов выше.`);
  }
  return facts;
}
