'use client';
import { useEffect, useRef, useState } from 'react';
import { BRIEF_TRAITS, isConfirmedBrief, normalizeBriefText } from '../contracts/brief';
import type { ConfirmedBrief } from '../contracts/brief';
import { publicError } from './publicResponses';
import './brief.css';

export type BriefDraft = { text: string; brief?: ConfirmedBrief };
export default function BriefEditor({ value, onChange }: { value: BriefDraft; onChange: (next: BriefDraft) => void }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const operation = useRef<AbortController | null>(null);
  useEffect(() => () => { operation.current?.abort(); operation.current = null; }, []);
  function edit(text: string) {
    operation.current?.abort(); operation.current = null; setPending(false); setError(''); onChange({ text });
  }
  async function interpret() {
    if (!value.text.trim() || pending) return;
    operation.current?.abort();
    const controller = new AbortController(); operation.current = controller;
    const current = () => operation.current === controller && !controller.signal.aborted;
    setPending(true); setError('');
    try {
      const response = await fetch('/api/brief', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: value.text }), signal: controller.signal });
      const data: unknown = await response.json();
      if (!current()) return;
      if (response.ok && data && typeof data === 'object' && 'brief' in data && isConfirmedBrief(data.brief) &&
          data.brief.text === normalizeBriefText(value.text)) {
        onChange({ text: value.text, brief: data.brief });
      } else {
        const failure = publicError(data);
        setError('Не удалось разобрать пожелания. Повторите попытку или очистите это необязательное поле.' +
          (failure?.requestId ? ` Код обращения: ${failure.requestId}` : ''));
      }
    } catch { if (current()) setError('Нет ответа сервиса. Повторите попытку или очистите пожелания.'); }
    finally { if (current()) { operation.current = null; setPending(false); } }
  }
  return <section className="brief-editor" aria-labelledby="brief-label">
    <label id="brief-label" htmlFor="brief-text">Пожелания к подрядчику <span className="secondary">— необязательно</span></label>
    <p id="brief-help">Опишите стиль и то, чего хотите избежать. Например: «Ненавязчивый ведущий, без принудительных конкурсов».</p>
    <textarea id="brief-text" name="brief" rows={3} maxLength={1000} value={value.text} aria-describedby="brief-help brief-status"
      onChange={event => edit(event.target.value)} placeholder="Что для вас важно?"/>
    <div className="brief-actions"><button type="button" onClick={interpret} disabled={!value.text.trim() || pending}>
      {pending ? 'Разбираем пожелания…' : 'Разобрать пожелания'}</button>
      {value.text && <button type="button" className="brief-clear" onClick={() => edit('')}>Очистить пожелания</button>}</div>
    <div id="brief-status" role="status" aria-live="polite">
      {pending && <p>ИИ уточняет смысл пожеланий. Условия мероприятия останутся прежними.</p>}
      {value.brief && <><p>Проверьте трактовку. Удалите лишнее; кнопка «Подобрать» подтвердит оставшиеся условия.</p>
        {!value.brief.conditions.length && <p>Нет условий для сопоставления. Уточните текст или выполните обычный подбор.</p>}
        <ul className="brief-conditions">{value.brief.conditions.map((condition, index) => <li key={`${condition.text}-${index}`}>
          <div><strong>«{condition.text}»</strong><span>{condition.trait === null ? 'Нет признака в каталоге — уточним у подрядчика' :
            `${condition.intent === 'prefer' ? 'Желательно' : 'Нежелательно'}: ${BRIEF_TRAITS[condition.trait]}`}</span></div>
          <button type="button" aria-label={`Удалить условие ${condition.text}`} onClick={() => onChange({ text: value.text,
            brief: { ...value.brief!, conditions: value.brief!.conditions.filter((_, i) => i !== index) } })}>Удалить</button>
        </li>)}</ul>
        <p className="brief-note">Учитываем подтверждённые сведения из анкет. Отсутствие сведений означает «нужно уточнить», а не гарантию.</p>
      </>}
    </div>
    {error && <p role="alert" className="error">{error}</p>}
  </section>;
}
