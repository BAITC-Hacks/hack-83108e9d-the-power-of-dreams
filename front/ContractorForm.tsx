'use client';
import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import type { CatalogOptions, RecommendationRequest, RecommendationResponse } from '../contracts/contractor-selection';
import { compareRecommendations, requestKey } from './compareRecommendations';
import { isOptionsResponse, isRecommendationResponse, publicError } from './publicResponses';
import RecommendationResults, { conditions } from './RecommendationResults';
import './flow.css';

type Draft = Record<keyof RecommendationRequest, string>;
const fieldOrder: (keyof Draft)[] = ['city', 'date', 'eventFormat', 'category', 'budgetKzt', 'language', 'durationHours'];
const blank: Draft = { city: '', date: '', eventFormat: '', category: '', budgetKzt: '', language: '', durationHours: '' };
function defaults(options: CatalogOptions): Draft {
  const preferred = (values: readonly string[], value: string) => values.includes(value) ? value : values[0]!;
  return { city: preferred(options.cities, 'Алматы'), category: preferred(options.categories, 'Ведущий'), eventFormat: preferred(options.eventFormats, 'корпоратив'),
    date: '2026-10-10' >= options.dateWindow.min && '2026-10-10' <= options.dateWindow.max ? '2026-10-10' : options.dateWindow.min,
    budgetKzt: '1500000', language: '', durationHours: '' };
}
function requestFrom(draft: Draft): RecommendationRequest {
  return { city: draft.city, date: draft.date, eventFormat: draft.eventFormat, category: draft.category, budgetKzt: Number(draft.budgetKzt),
    ...(draft.language ? { language: draft.language } : {}), ...(draft.durationHours.trim() ? { durationHours: Number(draft.durationHours.replace(',', '.')) } : {}) };
}

export default function ContractorForm() {
  const [options, setOptions] = useState<CatalogOptions>();
  const [optionsError, setOptionsError] = useState('');
  const [draft, setDraft] = useState<Draft>(blank);
  const [success, setSuccess] = useState<{ result: RecommendationResponse; narrative: string[] }>();
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState<RecommendationRequest>();
  const [reload, setReload] = useState(0);
  const active = useRef<{ controller: AbortController; key: string } | null>(null);
  const form = useRef<HTMLFormElement>(null);
  const disclosure = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const controller = new AbortController(); setOptionsError('');
    fetch('/api/catalog/options', { signal: controller.signal }).then(async response => {
      const data: unknown = await response.json();
      if (!response.ok || !isOptionsResponse(data)) throw new Error('options');
      if (!controller.signal.aborted) { setOptions(data.options); setDraft(defaults(data.options)); }
    }).catch(() => { if (!controller.signal.aborted) setOptionsError('Каталог недоступен. Попробуйте загрузить его ещё раз.'); });
    return () => { controller.abort(); };
  }, [reload]);
  useEffect(() => () => { active.current?.controller.abort(); active.current = null; }, []);

  function showFields(errors: Record<string, string>) {
    setFieldErrors(errors);
    const first = fieldOrder.find(field => errors[field]);
    if (!first) return;
    if ((errors.language || errors.durationHours) && disclosure.current) disclosure.current.open = true;
    (form.current?.elements.namedItem(first) as HTMLElement | null)?.focus();
  }
  const dateError = options ? `Выберите дату с ${options.dateWindow.min} по ${options.dateWindow.max} включительно.` : '';
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!options) return;
    const request = requestFrom(draft);
    const errors: Record<string, string> = {};
    for (const [field, choices] of [['city', options.cities], ['category', options.categories], ['eventFormat', options.eventFormats]] as const) {
      if (!choices.includes(draft[field])) errors[field] = 'Выберите значение из списка.';
    }
    if (!draft.date || draft.date < options.dateWindow.min || draft.date > options.dateWindow.max) errors.date = dateError;
    if (!Number.isSafeInteger(request.budgetKzt) || request.budgetKzt <= 0) errors.budgetKzt = 'Введите положительную целую сумму в тенге.';
    if (draft.language && !options.languages.includes(draft.language)) errors.language = 'Выберите язык из списка.';
    const durationInput = form.current?.elements.namedItem('durationHours') as HTMLInputElement | null;
    if (durationInput?.validity.badInput || (draft.durationHours.trim() && (!Number.isFinite(request.durationHours) || request.durationHours! <= 0))) errors.durationHours = 'Введите положительное число часов, например 2,5.';
    if (Object.keys(errors).length) { setError('Проверьте заполнение полей.'); showFields(errors); return; }
    const key = requestKey(request);
    if (active.current?.key === key) return;
    active.current?.controller.abort();
    const operation = { controller: new AbortController(), key }; active.current = operation;
    const current = () => active.current === operation && !operation.controller.signal.aborted;
    setError(''); setFieldErrors({}); setPending(request);
    try {
      const response = await fetch('/api/recommendations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(request), signal: operation.controller.signal });
      const data: unknown = await response.json();
      if (!current()) return;
      const failure = publicError(data);
      if (failure) {
        const message = failure.code === 'CATALOG_UNAVAILABLE' ? 'Каталог временно недоступен. Попробуйте позже.' :
          ['INVALID_REQUEST', 'DATE_OUT_OF_RANGE'].includes(failure.code) ? 'Проверьте заполнение полей и повторите подбор.' : 'Не удалось выполнить подбор. Попробуйте ещё раз.';
        setError(message + (failure.requestId ? ` Код обращения: ${failure.requestId}` : ''));
        showFields(Object.fromEntries(failure.fields.filter(field => fieldOrder.includes(field as keyof Draft)).map(field => [field, field === 'date' ? dateError : 'Проверьте значение этого поля.'])));
      } else if (response.ok && isRecommendationResponse(data)) {
        setSuccess(previous => ({ result: data, narrative: compareRecommendations(previous?.result, data) }));
      } else setError('Сервис вернул непригодный ответ. Повторите подбор.');
    } catch { if (current()) setError('Не удалось получить ответ сервиса. Проверьте соединение и повторите подбор.'); }
    finally { if (current()) { active.current = null; setPending(undefined); } }
  }
  function reset() {
    active.current?.controller.abort(); active.current = null;
    setPending(undefined); setSuccess(undefined); setError(''); setFieldErrors({});
    if (options) setDraft(defaults(options));
    if (disclosure.current) disclosure.current.open = false;
    (form.current?.elements.namedItem('city') as HTMLElement | null)?.focus();
  }
  const edit = (field: keyof Draft, value: string) => { setDraft(previous => ({ ...previous, [field]: value })); setFieldErrors(previous => { const next = { ...previous }; delete next[field]; return next; }); };
  const attributes = (field: keyof Draft) => ({ id: field, name: field, value: draft[field], 'aria-invalid': !!fieldErrors[field],
    'aria-describedby': [field === 'date' ? 'date-help' : '', fieldErrors[field] ? `${field}-error` : ''].filter(Boolean).join(' ') || undefined });
  const fieldError = (field: keyof Draft) => fieldErrors[field] && <p className="field-error" id={`${field}-error`}>{fieldErrors[field]}</p>;
  const selectField = (field: keyof Draft, label: string, values: readonly string[], optional = false) => <div className="field">
    <label htmlFor={field}>{label}</label><select {...attributes(field)} onChange={event => edit(field, event.target.value)} required={!optional}>
      {optional && <option value="">Без ограничения</option>}{values.map(value => <option key={value}>{value}</option>)}
    </select>{fieldError(field)}</div>;
  const changed = !!success && requestKey(requestFrom(draft)) !== requestKey(success.result.normalizedRequest);
  return <main><header><h1>Подбор подрядчиков</h1><p>Укажите условия мероприятия — найдём подходящие варианты в каталоге.</p></header>
    <div className="workspace"><section className="form-panel" aria-labelledby="conditions"><h2 id="conditions">Ваше мероприятие</h2>
      {!options ? <><p role="status">{optionsError || 'Загружаем каталог…'}</p>{optionsError && <button onClick={() => setReload(value => value + 1)}>Загрузить снова</button>}</> :
        <form ref={form} onSubmit={submit} noValidate>
          {selectField('city', 'Город', options.cities)}
          <div className="field"><label htmlFor="date">Дата мероприятия</label><input {...attributes('date')} type="date" required min={options.dateWindow.min} max={options.dateWindow.max} onChange={event => edit('date', event.target.value)}/><small id="date-help">Календарь: {options.dateWindow.min} — {options.dateWindow.max}, включительно</small>{fieldError('date')}</div>
          {selectField('eventFormat', 'Формат мероприятия', options.eventFormats)}
          {selectField('category', 'Категория подрядчика', options.categories)}
          <div className="field"><label htmlFor="budgetKzt">Бюджет, ₸</label><input {...attributes('budgetKzt')} type="number" min="1" max="9007199254740991" step="1" required onChange={event => edit('budgetKzt', event.target.value)}/>{fieldError('budgetKzt')}</div>
          <details ref={disclosure} className="optional-conditions"><summary>Дополнительные условия</summary>
            {selectField('language', 'Язык', options.languages, true)}
            <div className="field"><label htmlFor="durationHours">Длительность, часов</label><input {...attributes('durationHours')} type="text" inputMode="decimal" onChange={event => edit('durationHours', event.target.value)}/>{fieldError('durationHours')}</div>
          </details>
          <div className="form-actions"><button type="submit">Подобрать</button><button className="reset-button" type="button" onClick={reset}>Сбросить</button></div>
        </form>}
      <p className="fine-print">Цены указаны за мероприятие, начиная с суммы в каталоге. Итоговые условия уточняются у подрядчика.</p></section>
      <section className="results" aria-labelledby="results-heading" aria-busy={!!pending}><h2 id="results-heading">Подходящие варианты</h2>
        <div role="status" aria-live="polite" aria-atomic="true">
          {pending ? <p>Подбираем… {conditions(pending)}</p> : success && <p className="secondary">Подбор завершён. Показано: {success.result.cards.length}.</p>}
          {changed && <p>Условия изменены — выполните подбор</p>}
        </div>
        {error && <p role="alert" className="error">{error}</p>}
        {!success && !pending && !error && <p className="placeholder">Здесь появятся до трёх подрядчиков и причины, по которым они подходят.</p>}
        {success && <RecommendationResults result={success.result} narrative={success.narrative} previous={!!pending}/>}
      </section></div></main>;
}
