import type { BriefAdvice as Advice } from '../contracts/brief';
import './brief.css';
export default function BriefAdvice({ advice }: { advice: Advice }) {
  return <div className="brief-advice">
    {advice.evidence.filter(e => e.relation === 'match').length > 0 && <section><h4>Подтверждено анкетой</h4>
      {advice.evidence.filter(e => e.relation === 'match').map(e => <div className="brief-fact" key={e.condition.text}>
        <p>Ваше пожелание: «{e.condition.text}»</p><blockquote>{e.quote}</blockquote></div>)}</section>}
    {advice.evidence.filter(e => e.relation === 'conflict').length > 0 && <section className="brief-conflict"><h4>Есть расхождение с пожеланиями</h4>
      {advice.evidence.filter(e => e.relation === 'conflict').map(e => <div className="brief-fact" key={e.condition.text}>
        <p>Ваше условие: «{e.condition.text}». В анкете указано:</p><blockquote>{e.quote}</blockquote></div>)}</section>}
    {advice.unknownConditions.length > 0 && <section><h4>Нужно уточнить</h4>
      <ul>{advice.unknownConditions.map(c => <li key={c.text}>«{c.text}» — в анкете нет подтверждения.</li>)}</ul></section>}
    <section className="brief-question"><h4>Что спросить</h4><p>{advice.question}</p></section>
  </div>;
}
