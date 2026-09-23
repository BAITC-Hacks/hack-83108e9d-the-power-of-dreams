import type { RecommendationRequest, RecommendationResponse } from '../contracts/contractor-selection';
const modes = { openai_evidence: 'ИИ выбрал цитаты из описаний; условия проверены по каталогу.', mixed: 'Часть объяснений сформирована без ИИ', catalog_fallback: 'Объяснения сформированы по полям каталога без ИИ', not_needed: '' };
const money = (value: number) => new Intl.NumberFormat('ru-RU').format(value);
export function conditions(request: RecommendationRequest): string {
  return `${request.city} · ${request.date} · ${request.eventFormat} · ${request.category} · бюджет ${money(request.budgetKzt)} ₸ · ${request.language ? `язык: ${request.language}` : 'любой язык'} · ${request.durationHours !== undefined ? `${request.durationHours} ч` : 'длительность не указана'}`;
}
export default function RecommendationResults({ result, narrative, previous }: { result: RecommendationResponse; narrative: string[]; previous: boolean }) {
  return <div className="successful-result"><p className="successful-conditions"><strong>{previous ? 'Предыдущий результат' : 'Условия результата'}:</strong> {conditions(result.normalizedRequest)}</p>
    <p>{result.outcome === 'category_absent' ? 'В каталоге этого города нет подрядчиков выбранной категории. Измените город или категорию.' : result.outcome === 'no_match' ? 'По этим условиям подходящих вариантов нет. Проверьте условия с учётом причин исключения ниже.' : `Подходят ${result.summary.eligibleCount} из ${result.summary.candidateCount}. Показываем ${result.cards.length} по возрастанию стартовой цены; при равной цене — по идентификатору каталога.`}</p>
    {result.summary.candidateCount > result.summary.eligibleCount && <p className="secondary">Исключены по первой неподходящей причине (каждый подрядчик учтён один раз): занятость — {result.summary.exclusions.busy}, бюджет — {result.summary.exclusions.budget}, формат — {result.summary.exclusions.format}, язык — {result.summary.exclusions.language}, длительность — {result.summary.exclusions.duration}.</p>}
    {narrative.length > 0 && <div className="date-comparison">{narrative.map(line => <p key={line}>{line}</p>)}</div>}
    {modes[result.explanationMode] && <p className="mode">{modes[result.explanationMode]}</p>}
    {result.cards.map(card => <article className="contractor" key={card.id} data-profile-id={card.id}><div className="card-heading"><h3>{card.name}</h3><strong>от {money(card.priceFromKzt)} ₸</strong></div>
      <p className="secondary">{card.category} · {card.city}</p><p className="explanation">{card.explanation}</p>
      <p className="calendar">Нет отметки занятости на {result.normalizedRequest.date} в календаре набора</p>
      <p className="provenance">{card.qualityFlags.synthetic ? 'Синтетическая анкета набора.' : 'Анонимизированная анкета набора.'}{card.qualityFlags.cityImputed && ' Город заполнен при подготовке.'}{card.qualityFlags.priceImputed && ' Цена заполнена при подготовке.'} Данные каталога не подтверждают бронирование.</p>
    </article>)}
  </div>;
}
