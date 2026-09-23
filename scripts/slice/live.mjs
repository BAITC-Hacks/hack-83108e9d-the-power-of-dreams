// One billable dense-domain check. Only accepted excerpts/public explanations are printed.
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { loadCatalog } from '../../back/catalog/load.ts';
import { select } from '../../back/domain/select.ts';
import { createSelectEvidence } from '../../back/ai/evidence/select.ts';
import { createRecommend } from '../../back/recommend/recommend.ts';
import { createOpenAIFromEnv } from '../../back/ai/openai.mjs';
const request = { city: 'Алматы', category: 'Ведущий', eventFormat: 'корпоратив', date: '2026-10-10', budgetKzt: 1500000 };
const loaded = await loadCatalog(resolve('raw/dataset.csv'));
if (loaded.status !== 'ready') throw new Error('Catalogue unavailable');
let model, usage;
const adapter = createOpenAIFromEnv(process.argv[2] ? { envFile: resolve(process.argv[2]) } : {});
const evidence = createSelectEvidence({ generate: async input => {
  const result = await adapter.generate(input); model = result.model; usage = result.usage; return result;
} });
const start = performance.now();
let evidenceVerdicts;
const observedEvidence = async (...args) => {
  const result = await evidence(...args);
  evidenceVerdicts = result.status === 'validated' ? Object.fromEntries(Object.entries(result.byId).map(([id, item]) => [id, item.status === 'accepted' ? 'source_match' : item.reason])) : result.reason;
  return result;
};
const result = await createRecommend(loaded.snapshot, select, observedEvidence)(request, new AbortController().signal);
console.log(JSON.stringify({ sourceSha: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  dataset: loaded.snapshot.catalogVersion, model, usage, evidenceVerdicts, durationMs: Math.round(performance.now() - start), ...result }, null, 2));
if (result.explanationMode !== 'openai_evidence') process.exitCode = 1;
