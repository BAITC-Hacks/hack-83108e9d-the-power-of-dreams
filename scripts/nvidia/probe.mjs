// One real feasibility request. Never imported by the application.
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { loadCatalog } from '../../back/catalog/load.ts';
import { select } from '../../back/domain/select.ts';
import { loadSecrets } from '../../back/config/secrets.mjs';

const root = new URL('../../', import.meta.url);
const model = 'nvidia/llama-3.2-nv-rerankqa-1b-v2';
const endpoint = 'https://ai.api.nvidia.com/v1/retrieval/nvidia/llama-3_2-nv-rerankqa-1b-v2/reranking';
const request = { city: 'Алматы', category: 'Ведущий', eventFormat: 'корпоратив', date: '2026-10-10', budgetKzt: 1500000 };
const rubric = { 'HK-88430': 2, 'HK-29829': 0, 'HK-27222': 1, 'HK-77838': 1, 'HK-75012': 1 };
const ordinal = (a, b) => a < b ? -1 : a > b ? 1 : 0;
const query = `Подрядчик категории «${request.category}» для мероприятия формата «${request.eventFormat}».`;
const startedAt = new Date().toISOString();
const record = { startedAt, model, endpoint, templateVersion: 'category-format-ru-v1', request,
  mode: 'live-feasibility-only', automaticRetries: 0, deadlineMs: 10000,
  cost: 'unknown', usage: 'not reported', decision: 'deferred',
  inputLimitStatus: 'Full generation blocked until exact token/input-fit verification; character counts are not tokens.' };
let attemptedRequests = 0;
const began = performance.now();
try {
  const catalog = await loadCatalog(fileURLToPath(new URL('raw/dataset.csv', root)));
  if (catalog.status !== 'ready') throw new Error('CATALOG_UNAVAILABLE');
  const { profiles, catalogVersion } = catalog.snapshot;
  // Call the same pure eligibility rules for each profile; never clone filter logic.
  const eligible = profiles.filter(p => select([p], request).outcome === 'matched').sort((a, b) => ordinal(a.id, b.id));
  if (eligible.length !== 5 || eligible.some(p => !Object.hasOwn(rubric, p.id))) throw new Error('CHECKPOINT_INPUT_CHANGED');
  const groups = new Map();
  for (const p of profiles) for (const category of p.categories) for (const format of p.eventFormats) {
    const key = JSON.stringify([category, format]); groups.set(key, (groups.get(key) ?? 0) + 1);
  }
  Object.assign(record, { catalogVersion, rubric, query,
    fullGenerationEstimate: { requests: groups.size, scoredPairs: [...groups.values()].reduce((a, b) => a + b, 0), cost: 'unknown' },
    eligible: eligible.map(p => ({ id: p.id, priceFromKzt: p.priceFromKzt, relevance: rubric[p.id],
      descriptionSha256: createHash('sha256').update(p.description).digest('hex'),
      pairUtf8Bytes: Buffer.byteLength(query + p.description, 'utf8') })),
    baselineIds: select(profiles, request).selectedIds });
  const envFile = process.argv[2];
  const { NVIDIA_API_KEY } = loadSecrets({ required: ['NVIDIA_API_KEY'], ...(envFile ? { envFile } : {}) });
  const controller = new AbortController();
  const cancel = () => controller.abort();
  process.once('SIGINT', cancel);
  const timer = setTimeout(() => controller.abort(), 10000);
  let response;
  let body;
  try {
    attemptedRequests++;
    response = await fetch(endpoint, { method: 'POST', signal: controller.signal,
      headers: { Authorization: `Bearer ${NVIDIA_API_KEY}`, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ model, query: { text: query }, passages: eligible.map(p => ({ text: p.description })), truncate: 'NONE' }) });
    record.httpStatus = response.status;
    if (!response.ok) { await response.body?.cancel(); throw new Error(`HTTP_${response.status}`); }
    body = await response.json();
  } finally { clearTimeout(timer); process.removeListener('SIGINT', cancel); }
  const ranks = body?.rankings;
  if (!Array.isArray(ranks) || ranks.length !== eligible.length || new Set(ranks.map(r => r?.index)).size !== eligible.length ||
    ranks.some(r => !Number.isInteger(r?.index) || r.index < 0 || r.index >= eligible.length || !Number.isFinite(r?.logit))) {
    throw new Error('INVALID_RESPONSE');
  }
  const scored = ranks.map(r => ({ id: eligible[r.index].id, score: r.logit, priceFromKzt: eligible[r.index].priceFromKzt }));
  scored.sort((a, b) => b.score - a.score || a.priceFromKzt - b.priceFromKzt || ordinal(a.id, b.id));
  const semanticIds = scored.slice(0, 3).map(p => p.id);
  const grade = ids => ids.reduce((sum, id) => sum + rubric[id], 0);
  const inversions = ids => ids.reduce((n, id, i) => n + ids.slice(i + 1).filter(other => rubric[id] < rubric[other]).length, 0);
  const sameSet = semanticIds.every(id => record.baselineIds.includes(id));
  const improved = grade(semanticIds) > grade(record.baselineIds) && semanticIds[0] === 'HK-88430' ||
    sameSet && inversions(semanticIds) < inversions(record.baselineIds);
  Object.assign(record, { status: 'validated', scores: scored, semanticIds,
    baselineRelevance: grade(record.baselineIds), semanticRelevance: grade(semanticIds),
    decision: improved ? 'positive-quality-checkpoint-input-fit-still-required' : 'rejected-no-rubric-improvement' });
} catch (error) {
  const safe = /^(CATALOG_UNAVAILABLE|CHECKPOINT_INPUT_CHANGED|HTTP_\d{3}|INVALID_RESPONSE)$/.test(error.message) ? error.message
    : error.name === 'AbortError' || error.name === 'TimeoutError' ? 'TIMEOUT_OR_CANCELLED'
      : String(error.code ?? '').startsWith('CONFIG_') ? error.code : 'NETWORK_OR_UNEXPECTED_FAILURE';
  Object.assign(record, { status: 'failed', failure: safe });
  process.exitCode = 1;
}
Object.assign(record, { attemptedRequests, durationMs: Math.round(performance.now() - began), finishedAt: new Date().toISOString() });
const dir = new URL('openspec/changes/nvidia-semantic-ranking/evidence/', root);
await mkdir(dir, { recursive: true });
const output = new URL(`probe-${startedAt.replace(/[:.]/g, '-')}.json`, dir);
await writeFile(output, JSON.stringify(record, null, 2) + '\n', { flag: 'wx' });
console.log(JSON.stringify(record, null, 2));
console.log(`Evidence: ${fileURLToPath(output)}`);
