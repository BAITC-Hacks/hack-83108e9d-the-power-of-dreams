import type { RecommendationRequest, RecommendationResponse } from '../contracts/contractor-selection';
import { displayDate, money, optionalConditions } from './display';
import BriefAdvice from './BriefAdvice';

const modes = {
  openai_evidence: 'ИИ выбрал цитаты из описаний; условия проверены по каталогу.',
  mixed: 'Часть объяснений сформирована без ИИ',
  catalog_fallback: 'Объяснения сформированы по полям каталога без ИИ',
  not_needed: '',
  brief_evidence: 'Порядок учитывает подтверждённые пожелания и сведения из анкет. Цитаты описывают заявления подрядчика, а не независимую проверку.',
};
const exclusionLabels = { busy: 'занятость на дату', budget: 'бюджет', format: 'формат', language: 'язык', duration: 'длительность' };

export function conditions(request: RecommendationRequest): string {
  const optional = optionalConditions(request.language, request.durationHours);
  return `${request.city}, ${displayDate(request.date)}, ${request.eventFormat}, ${request.category}. Бюджет ${money(request.budgetKzt)} ₸${optional ? `; ${optional}` : '; без ограничений по языку и длительности'}.`;
}

// Original outline geometry; category text remains the accessible label.
function CategoryIcon({ category }: { category: string }) {
  const paths: Record<string, string> = {
    'Ведущий': 'M9 4a3 3 0 0 1 6 0v7a3 3 0 0 1-6 0V4ZM6 10v1a6 6 0 0 0 12 0v-1M12 17v5M8 22h8',
    'Фотограф': 'M4 6h4l2-3h4l2 3h4v14H4V6ZM16 13a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
    'Видеограф': 'M3 6h12v13H3V6ZM15 10l6-4v13l-6-4',
    'Флорист': 'M12 13C2 12 3 5 7 7c-2-7 8-7 6-1 6-4 9 4 3 6l-4 1ZM12 13v9M12 20c-5 0-7-3-7-5 4 0 7 2 7 5ZM12 18c4 0 6-2 7-4',
    'DJ': 'M4 14v-3a8 8 0 0 1 16 0v3M4 12h3v8H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2ZM20 12h-3v8h3a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Z',
  };
  return <span className="category-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={paths[category] ?? 'M4 4h6v6H4V4ZM14 4h6v6h-6V4ZM4 14h6v6H4v-6ZM14 14h6v6h-6v-6Z'}/></svg></span>;
}

export default function RecommendationResults({ result, narrative, previous }: { result: RecommendationResponse; narrative: string[]; previous: boolean }) {
  const { summary, normalizedRequest: request } = result;
  const labels = [request.city, displayDate(request.date), request.eventFormat, request.category, `Бюджет ${money(request.budgetKzt)} ₸`,
    request.language ? `Язык: ${request.language}` : 'Без ограничения по языку',
    request.durationHours !== undefined ? `Длительность: ${optionalConditions(undefined, request.durationHours)}` : 'Без ограничения по длительности'];
  const exclusions = Object.entries(summary.exclusions).filter(([, count]) => count > 0)
    .map(([reason, count]) => `${exclusionLabels[reason as keyof typeof exclusionLabels]} — ${count}`).join('; ');
  const incomplete = result.outcome === 'matched' && result.cards.length < 3;
  return <div className="successful-result">
    <div className="result-overview">
      <div className="successful-conditions"><p>{previous ? 'Предыдущий результат' : 'Условия результата'}</p><ul className="condition-labels" aria-label={previous ? 'Условия предыдущего результата' : 'Условия результата'}>{labels.map((label, index) => <li key={index}>{label}</li>)}</ul></div>
      {request.brief && <p className="confirmed-wishes"><strong>Подтверждённые пожелания:</strong> {request.brief.conditions.map(c => `«${c.text}»`).join('; ')}.</p>}
      {result.outcome === 'matched' ? <p className="result-count">Подходят <strong>{summary.eligibleCount} из {summary.candidateCount}</strong>. Показываем {result.cards.length}.</p> :
        <div className="empty-result"><span className="empty-symbol" aria-hidden="true">{result.outcome === 'category_absent' ? '∅' : '—'}</span>
          <h3>{result.outcome === 'category_absent' ? 'В этом городе нет такой категории' : 'По этим условиям вариантов нет'}</h3>
          <p>{result.outcome === 'category_absent' ? 'В каталоге этого города нет подрядчиков выбранной категории. Измените город или категорию.' : 'Кандидаты есть, но ни один не проходит по всем условиям. Причины исключения ниже помогут понять, что можно изменить.'}</p>
        </div>}
      {incomplete && <p className="outcome-reason">Почему меньше трёх: в этой категории и городе в каталоге {summary.candidateCount}; всем условиям соответствуют {summary.eligibleCount}.</p>}
      {(incomplete || result.outcome === 'no_match') && exclusions && <p className="outcome-reason">Причины исключения: {exclusions}. Каждый подрядчик учтён один раз, по первой неподходящей причине.</p>}
      {modes[result.explanationMode] && <p className="mode"><span className="mode-dot" aria-hidden="true"/>{modes[result.explanationMode]}</p>}
    </div>
    {narrative.length > 0 && <div className="date-comparison"><h3>Что изменилось с датой</h3>{narrative.map(line => <p key={line}>{line.replace(/\b\d{4}-\d{2}-\d{2}\b/g, displayDate)}</p>)}</div>}
    <div className="contractor-list">
      {result.cards.map(card => <article className="contractor" key={card.id} data-profile-id={card.id}>
        <div className="card-heading"><div className="card-identity"><CategoryIcon category={card.category}/><div><p className="card-category">{card.category}<span>{card.city}</span></p><h3>{card.name}</h3></div></div><strong className="card-price"><span>от</span> {money(card.priceFromKzt)} <span>₸</span></strong></div>
        <p className="explanation">{card.explanation}</p>
        {card.briefAdvice && <BriefAdvice advice={card.briefAdvice}/>}
        <p className="calendar"><svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="4.5" width="14" height="13" rx="2"/><path d="M6.5 2v5M13.5 2v5M3 9h14m-10 4 2 2 4-4"/></svg><span>Нет отметки занятости на <time dateTime={request.date}>{displayDate(request.date)}</time></span></p>
        <p className="provenance">{card.qualityFlags.synthetic ? 'Синтетическая анкета набора.' : 'Анонимизированная анкета набора.'}{card.qualityFlags.cityImputed && ' Город заполнен при подготовке.'}{card.qualityFlags.priceImputed && ' Цена заполнена при подготовке.'} Данные каталога не подтверждают бронирование.</p>
      </article>)}
    </div>
    {summary.candidateCount > 0 && <details className="selection-details"><summary>Как получился этот список</summary>
      <p>{request.brief ? 'Сначала показаны подрядчики с меньшим числом расхождений и большим числом подтверждённых совпадений с пожеланиями. Затем — по стартовой цене и идентификатору каталога. Отсутствие сведений в анкете не означает несоответствие.' : 'Подходящие подрядчики показаны по возрастанию стартовой цены; при равной цене — по идентификатору каталога. Это порядок цены, а не оценка качества.'}</p>
      {exclusions && <p>Исключены по первой неподходящей причине: {exclusions}. Каждый подрядчик учтён один раз.</p>}
      <p>Цены начинаются с суммы в каталоге. Итоговую стоимость и возможность бронирования нужно уточнить у подрядчика.</p>
    </details>}
  </div>;
}
