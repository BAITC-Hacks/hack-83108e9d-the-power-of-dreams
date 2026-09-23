'use client';
import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import type { CatalogOptions, RecommendationRequest, RecommendationResponse } from '../contracts/contractor-selection';
import { compareRecommendations, requestKey } from './compareRecommendations';
import { isOptionsResponse, isRecommendationResponse, publicError } from './publicResponses';
import RecommendationResults, { conditions } from './RecommendationResults';
import { displayDate, money, optionalConditions } from './display';
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
  const conditionsPanel = useRef<HTMLDetailsElement>(null);
  const resultsHeading = useRef<HTMLHeadingElement>(null);
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
    if (conditionsPanel.current) conditionsPanel.current.open = true;
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
    if (conditionsPanel.current) conditionsPanel.current.open = true;
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
  const unsent = !!pending && requestKey(requestFrom(draft)) !== requestKey(pending);
  function showResults() {
    if (window.matchMedia('(max-width: 760px)').matches && conditionsPanel.current) conditionsPanel.current.open = false;
    resultsHeading.current?.focus({ preventScroll: true });
    resultsHeading.current?.scrollIntoView({ block: 'start' });
  }
  function showConditions() {
    if (conditionsPanel.current) conditionsPanel.current.open = true;
    (form.current?.elements.namedItem('city') as HTMLElement | null)?.focus({ preventScroll: true });
    conditionsPanel.current?.scrollIntoView({ block: 'start' });
  }
  const optionalSummary = optionalConditions(draft.language, draft.durationHours);
  return <main><header className="page-header"><div className="brand"><span className="brand-mark" aria-hidden="true"><i/><i/><i/></span>The Power of Dreams</div><div className="page-intro"><h1>Подрядчики для вашего события</h1><p>До трёх вариантов из каталога.<br/>{' '}С понятной причиной выбрать каждого.</p></div></header>
    <div className="workspace"><details ref={conditionsPanel} className="form-panel" open aria-labelledby="conditions"><summary className="conditions-toggle"><span><h2 id="conditions">Ваше мероприятие</h2><span className="collapsed-conditions">{draft.city}{draft.date && `, ${displayDate(draft.date)}`}</span></span><span className="toggle-chevron" aria-hidden="true"/></summary>
      <div className="conditions-content">
      {!options ? <><p role="status">{optionsError || 'Загружаем каталог…'}</p>{optionsError && <button onClick={() => setReload(value => value + 1)}>Загрузить снова</button>}</> :
        <form ref={form} onSubmit={submit} noValidate>
          <div className="form-fields">
          {selectField('city', 'Город', options.cities)}
          <div className="field"><label htmlFor="date">Дата мероприятия</label><input {...attributes('date')} type="date" required min={options.dateWindow.min} max={options.dateWindow.max} onChange={event => edit('date', event.target.value)}/>{fieldError('date')}</div>
          <small className="date-help" id="date-help">Календарь с {displayDate(options.dateWindow.min)} по {displayDate(options.dateWindow.max)}</small>
          {selectField('eventFormat', 'Формат мероприятия', options.eventFormats)}
          {selectField('category', 'Категория подрядчика', options.categories)}
          <div className="field budget-field"><label htmlFor="budgetKzt">Бюджет, ₸</label><input {...attributes('budgetKzt')} type="number" min="1" max="9007199254740991" step="1" required onChange={event => edit('budgetKzt', event.target.value)}/><small>{Number.isSafeInteger(Number(draft.budgetKzt)) && Number(draft.budgetKzt) > 0 ? `${money(Number(draft.budgetKzt))} ₸ за мероприятие` : 'Общий бюджет на одного подрядчика'}</small>{fieldError('budgetKzt')}</div>
          </div>
          <details ref={disclosure} className="optional-conditions"><summary><span>Дополнительные условия</span>{optionalSummary && <span className="optional-summary">{optionalSummary}</span>}</summary>
            {selectField('language', 'Язык', options.languages, true)}
            <div className="field"><label htmlFor="durationHours">Длительность, часов</label><input {...attributes('durationHours')} type="text" inputMode="decimal" onChange={event => edit('durationHours', event.target.value)}/>{fieldError('durationHours')}</div>
          </details>
          <div className="form-actions"><button type="submit"><span>Подобрать</span><svg viewBox="0 0 20 20" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5"/><path d="m13 13 4 4"/></svg></button><button className="reset-button" type="button" onClick={reset}>Сбросить</button></div>
          {pending && <p className="action-status">{unsent ? 'Подбор идёт. Новые правки ещё не отправлены.' : 'Подбираем по отправленным условиям…'}</p>}
        </form>}
      <p className="fine-print">Стартовые цены из каталога. Итоговые условия уточняются у подрядчика.</p></div></details>
      <section className="results" aria-labelledby="results-heading" aria-busy={!!pending}><div className="results-heading"><h2 ref={resultsHeading} tabIndex={-1} id="results-heading">Подходящие варианты</h2>{success && <span className="result-total" aria-label={`Показано карточек: ${success.result.cards.length}`}>{success.result.cards.length}</span>}</div>
        <div role="status" aria-live="polite" aria-atomic="true">
          {pending ? <p className="pending-message">Подбираем… {conditions(pending)}</p> : success && <p className="sr-only">Подбор завершён. Показано: {success.result.cards.length}.</p>}
          {pending ? unsent && <p className="changed-message">Есть новые неотправленные изменения. Текущий подбор использует отправленные условия.</p> : changed && <p className="changed-message">Условия изменены — выполните подбор</p>}
        </div>
        {error && <p role="alert" className="error">{error}</p>}
        {!success && !pending && !error && <div className="placeholder"><div className="preview-list" aria-hidden="true"><span/><span/><span/></div><h3>Хорошее событие начинается<br/>с подходящих людей</h3><p>Укажите, кого ищете и когда.<br/>Сравним условия с каталогом и объясним каждый вариант.</p><p className="placeholder-note">Учитываем бюджет, формат и отметки занятости.</p></div>}
        {success && <RecommendationResults result={success.result} narrative={success.narrative} previous={!!pending}/>}
      </section></div>
      {success && <nav className="mobile-results-nav" aria-label="Переход между условиями и результатом"><button className="reset-button" type="button" onClick={showConditions}>Условия</button><button type="button" onClick={showResults}>К результатам <span aria-hidden="true">{success.result.cards.length}</span></button></nav>}
      <footer className="page-footer">Подбор по каталогу, не бронирование. Решение остаётся за вами.</footer>
    </main>;
}
