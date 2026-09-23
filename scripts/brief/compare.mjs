// Explicit, billable operator command. No application traffic is started here.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { createOpenAIFromEnv } from '../../back/ai/openai.mjs';
import { createInterpretBrief, BRIEF_INSTRUCTIONS, BRIEF_FORMAT, BRIEF_MAX_OUTPUT } from '../../back/ai/brief/interpret.ts';
const args = process.argv.slice(2);
if (!args.includes('--live')) throw new Error('Use --live explicitly; this command incurs API charges up to its USD 5 ledger cap.');
const cases = JSON.parse(readFileSync(new URL(args.includes('--repair') ? './repair-cases.json' : './cases.json', import.meta.url), 'utf8'));
const limit = args.includes('--smoke') ? 2 : cases.length;
const repeats = args.includes('--smoke') ? 1 : 2;
const output = resolve('test-results'); mkdirSync(output, { recursive: true });
const ledgerPath = resolve(output, 'brief-live-budget.json');
const ledger = existsSync(ledgerPath) ? JSON.parse(readFileSync(ledgerPath, 'utf8')) : { ceilingUsd: 5, chargedOrReservedUsd: 0.01, calls: [] };
if (ledger.ceilingUsd !== 5 || !Number.isFinite(ledger.chargedOrReservedUsd) || ledger.chargedOrReservedUsd < 0.01) throw new Error('Invalid budget ledger');
const results = [];
for (const model of ['gpt-5.6-luna', 'gpt-5.6-terra']) {
  const prices = model.endsWith('luna') ? { input: 0.25, output: 1.2 } : { input: 2.5, output: 12 };
  const adapter = createOpenAIFromEnv({ model, ...(process.env.BRIEF_ENV_FILE ? { envFile: process.env.BRIEF_ENV_FILE } : {}) });
  for (let repeat = 1; repeat <= repeats; repeat++) for (const item of cases.slice(0, limit)) {
    let usage;
    const inputBound = Buffer.byteLength(JSON.stringify({ input: item.text, instructions: BRIEF_INSTRUCTIONS, format: BRIEF_FORMAT }), 'utf8') + 2048;
    const reserved = (inputBound * prices.input + BRIEF_MAX_OUTPUT * prices.output) / 1e6;
    if (ledger.chargedOrReservedUsd + reserved > ledger.ceilingUsd) throw new Error('USD 5 ceiling reached; no further call was sent.');
    const entry = { model, caseId: item.id, repeat, reservedUsd: reserved, status: 'reserved' };
    ledger.chargedOrReservedUsd += reserved; ledger.calls.push(entry);
    writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2));
    const start = Date.now();
    let row;
    try {
      const interpret = createInterpretBrief({ generate: async input => { const r = await adapter.generate(input); usage = r.usage; return r; } });
      const result = await interpret(item.text, new AbortController().signal);
      const actual = result.conditions.map(c => `${c.trait ?? 'unknown'}:${c.intent}`).sort();
      row = { model, caseId: item.id, repeat, durationMs: Date.now() - start, status: 'validated',
        expected: [...item.expected].sort(), actual, correct: JSON.stringify(actual) === JSON.stringify([...item.expected].sort()) };
    } catch (error) {
      row = { model, caseId: item.id, repeat, durationMs: Date.now() - start, status: 'failed', code: error.code ?? error.name, correct: false };
    }
    if (usage) {
      const cost = (usage.inputTokens * prices.input + usage.outputTokens * prices.output) / 1e6;
      ledger.chargedOrReservedUsd += cost - reserved; entry.costUpperUsd = cost; entry.usage = usage;
      if (cost > reserved) throw new Error('Cost reservation underestimate; stop before any further request.');
    }
    entry.status = row.status; entry.durationMs = row.durationMs;
    writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2));
    results.push(row);
    writeFileSync(resolve(output, args.includes('--repair') ? 'brief-repair.json' : args.includes('--smoke') ? 'brief-smoke.json' : 'brief-comparison.json'), JSON.stringify({
      corpusSha256: createHash('sha256').update(JSON.stringify(cases)).digest('hex'),
      promptSha256: createHash('sha256').update(BRIEF_INSTRUCTIONS).digest('hex'),
      chargedOrReservedUsd: ledger.chargedOrReservedUsd, results,
    }, null, 2));
    console.log(JSON.stringify({ operation: 'brief-evaluation', mode: 'live', model, caseId: item.id, durationMs: row.durationMs, errorCategory: row.status === 'failed' ? row.code : undefined, usage }));
  }
}
console.log(JSON.stringify({ operation: 'brief-evaluation-complete', calls: results.length,
  correct: results.filter(r => r.correct).length, chargedOrReservedUsd: ledger.chargedOrReservedUsd }));
