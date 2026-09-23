'use client';
import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import type { CatalogOptions, CatalogOptionsResponse, ErrorResponse, RecommendationResponse } from '../contracts/contractor-selection';

const modes = { openai_evidence: 'ИИ выбрал цитаты из описаний; условия проверены по каталогу.', mixed: 'Часть объяснений сформирована без ИИ', catalog_fallback: 'Объяснения сформированы по полям каталога без ИИ', not_needed: '' };
const money = (value: number) => new Intl.NumberFormat('ru-RU').format(value);
export default function ContractorForm() {
  const [options, setOptions] = useState<CatalogOptions>();
  const [result, setResult] = useState<RecommendationResponse>();
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [reload, setReload] = useState(0);
  const active = useRef<AbortController | null>(null);
  const submitting = useRef(false);
  useEffect(() => {
    const controller = new AbortController(); setError('');
    fetch('/api/catalog/options', { signal: controller.signal }).then(async response => {
      const data = await response.json() as CatalogOptionsResponse | ErrorResponse;
      if (!response.ok || 'error' in data) throw new Error('Каталог недоступен. Попробуйте загрузить его ещё раз.');
      if (!controller.signal.aborted) setOptions(data.options);
    }).catch(() => { if (!controller.signal.aborted) setError('Каталог недоступен. Попробуйте загрузить его ещё раз.'); });
    return () => { controller.abort(); active.current?.abort(); };
  }, [reload]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (submitting.current) return;
    const values = new FormData(event.currentTarget);
    const request = { city: String(values.get('city')), category: String(values.get('category')), eventFormat: String(values.get('eventFormat')),
      date: String(values.get('date')), budgetKzt: Number(values.get('budgetKzt')) };
    setError(''); setFieldErrors({}); setResult(undefined);
    if (!Number.isSafeInteger(request.budgetKzt) || request.budgetKzt <= 0) { setFieldErrors({ budgetKzt: 'Введите положительную целую сумму в тенге.' }); return; }
    active.current?.abort(); const controller = new AbortController(); active.current = controller;
    submitting.current = true; setPending(true);
    try {
      const response = await fetch('/api/recommendations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(request), signal: controller.signal });
      const data = await response.json() as RecommendationResponse | ErrorResponse;
      if (controller.signal.aborted || active.current !== controller) return;
      if ('error' in data) {
        setError(data.error.code === 'CATALOG_UNAVAILABLE' ? 'Каталог временно недоступен. Попробуйте позже.' : data.error.code === 'INTERNAL_ERROR' ? 'Не удалось выполнить подбор. Попробуйте ещё раз.' : 'Проверьте заполнение полей.');
        setFieldErrors(Object.fromEntries((data.error.fields ?? []).map(f => [f.field, f.field === 'date' ? 'Выберите корректную дату с 23 сентября по 31 декабря 2026 года.' : 'Проверьте значение этого поля.'])));
      } else if (response.ok) setResult(data);
      else setError('Не удалось выполнить подбор. Попробуйте ещё раз.');
    } catch { if (!controller.signal.aborted) setError('Не удалось связаться с сервисом. Проверьте соединение и повторите подбор.'); }
    finally { if (active.current === controller) { submitting.current = false; setPending(false); } }
  }
  const selectField = (name: string, label: string, values: readonly string[], preferred: string) => <div className="field">
    <label htmlFor={name}>{label}</label><select id={name} name={name} defaultValue={values.includes(preferred) ? preferred : values[0]} required aria-invalid={!!fieldErrors[name]} aria-describedby={fieldErrors[name] ? `${name}-error` : undefined}>
      {values.map(value => <option key={value}>{value}</option>)}
    </select>{fieldErrors[name] && <p className="field-error" id={`${name}-error`}>{fieldErrors[name]}</p>}</div>;
  return <main><header><h1>Подбор подрядчиков</h1><p>Укажите условия мероприятия — найдём подходящие варианты в каталоге.</p></header>
    <div className="workspace"><section className="form-panel" aria-labelledby="conditions"><h2 id="conditions">Ваше мероприятие</h2>
      {!options ? <><p role="status">{error || 'Загружаем каталог…'}</p>{error && <button onClick={() => setReload(v => v + 1)}>Загрузить снова</button>}</> :
        <form onSubmit={submit}><fieldset disabled={pending}>
          {selectField('city', 'Город', options.cities, 'Алматы')}
          <div className="field"><label htmlFor="date">Дата мероприятия</label><input id="date" name="date" type="date" required min={options.dateWindow.min} max={options.dateWindow.max} defaultValue="2026-10-10" aria-invalid={!!fieldErrors.date} aria-describedby="date-help"/><small id="date-help">Календарь: 23 сентября — 31 декабря 2026</small>{fieldErrors.date && <p className="field-error">{fieldErrors.date}</p>}</div>
          {selectField('eventFormat', 'Формат мероприятия', options.eventFormats, 'корпоратив')}
          {selectField('category', 'Категория подрядчика', options.categories, 'Ведущий')}
          <div className="field"><label htmlFor="budgetKzt">Бюджет, ₸</label><input id="budgetKzt" name="budgetKzt" type="number" min="1" max="9007199254740991" step="1" defaultValue="1500000" required aria-invalid={!!fieldErrors.budgetKzt} aria-describedby={fieldErrors.budgetKzt ? 'budget-error' : undefined}/>{fieldErrors.budgetKzt && <p className="field-error" id="budget-error">{fieldErrors.budgetKzt}</p>}</div>
          <button type="submit">{pending ? 'Подбираем…' : 'Подобрать'}</button>
        </fieldset></form>}
      <p className="fine-print">Цены указаны за мероприятие, начиная с суммы в каталоге. Итоговые условия уточняются у подрядчика.</p></section>
      <section className="results" aria-labelledby="results-heading" aria-busy={pending}><h2 id="results-heading">Подходящие варианты</h2>
        <div role="status" aria-live="polite">{pending && <p>Проверяем условия и готовим объяснения…</p>}</div>
        {options && error && <p role="alert" className="error">{error}</p>}
        {!result && !pending && !error && <p className="placeholder">Здесь появятся до трёх подрядчиков и причины, по которым они подходят.</p>}
        {result && <><p>{result.outcome === 'category_absent' ? 'В каталоге этого города нет подрядчиков выбранной категории.' : result.outcome === 'no_match' ? 'По этим условиям подходящих вариантов нет. Попробуйте другую дату или бюджет.' : `Подходят ${result.summary.eligibleCount} из ${result.summary.candidateCount}. Показываем ${result.cards.length} по возрастанию стартовой цены; при равной цене — по идентификатору каталога.`}</p>
          {result.summary.candidateCount > result.summary.eligibleCount && <p className="secondary">Исключены по первой неподходящей причине: занятость — {result.summary.exclusions.busy}, бюджет — {result.summary.exclusions.budget}, формат — {result.summary.exclusions.format}, язык — {result.summary.exclusions.language}, длительность — {result.summary.exclusions.duration}.</p>}
          {modes[result.explanationMode] && <p className="mode">{modes[result.explanationMode]}</p>}
          {result.cards.map(card => <article className="contractor" key={card.id} data-profile-id={card.id}><div className="card-heading"><h3>{card.name}</h3><strong>от {money(card.priceFromKzt)} ₸</strong></div>
            <p className="secondary">{card.category} · {card.city}</p><p className="explanation">{card.explanation}</p>
            <p className="calendar">Нет отметки занятости на {result.normalizedRequest.date} в календаре набора</p>
            <p className="provenance">{card.qualityFlags.synthetic ? 'Синтетическая анкета набора.' : 'Анонимизированная анкета набора.'}{card.qualityFlags.cityImputed && ' Город заполнен при подготовке.'}{card.qualityFlags.priceImputed && ' Цена заполнена при подготовке.'} Данные каталога не подтверждают бронирование.</p>
          </article>)}</>}
      </section></div></main>;
}
