import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { loadCatalog } from './catalog/load.ts';
import { select, eligibleSelection } from './domain/select.ts';
import { loadBriefIndex, BriefIndexError } from './catalog/brief-index.ts';
import { matchBrief } from './brief/match.ts';
import { createInterpretBrief, BriefError } from './ai/brief/interpret.ts';
import type { InterpretBrief } from './ai/brief/interpret.ts';
import type { BriefIndex } from '../contracts/brief.ts';
import { createRecommend } from './recommend/recommend.ts';
import { createSelectEvidence, assertActive } from './ai/evidence/select.ts';
import type { EvidenceTransport } from './ai/evidence/select.ts';
import type { SelectEvidence } from './recommend/ports.ts';
import type { Services } from './http/handlers.ts';
import type { LoadCatalog } from './domain/types.ts';

export function createServices(path: string, load: LoadCatalog = loadCatalog, evidenceFactory: () => SelectEvidence | Promise<SelectEvidence> = configuredEvidence) {
  let retained: Promise<Services> | undefined;
  return () => retained ??= (async () => {
    const catalog = await load(path);
    if (catalog.status !== 'ready') return { catalog };
    let index: BriefIndex | undefined;
    try { index = loadBriefIndex(catalog.snapshot.profiles); }
    catch (error) { if (!(error instanceof BriefIndexError)) throw error; }
    return { catalog, interpretBrief: await configuredInterpreter(),
      recommend: createRecommend(catalog.snapshot, select, await evidenceFactory(), request => {
        if (!index || !request.brief) throw Object.assign(new Error('Brief index unavailable'), { code: 'BRIEF_INDEX_UNAVAILABLE' });
        const eligible = eligibleSelection(catalog.snapshot.profiles, request);
        const matches = matchBrief(eligible.eligible, request.brief, index);
        return { selection: { outcome: eligible.outcome, selectedIds: matches.slice(0, 3).map(m => m.id), summary: eligible.summary },
          matches, policyVersion: `brief-v1:${index.version}` };
      }) };
  })();
}
export async function configuredInterpreter(): Promise<InterpretBrief> {
  const moduleUrl = pathToFileURL(resolve(process.cwd(), 'back/ai/openai.mjs')).href;
  const { createOpenAIFromEnv } = await import(/* webpackIgnore: true */ moduleUrl);
  try { return createInterpretBrief(createOpenAIFromEnv()); }
  catch (error) {
    if (!['CONFIG_REQUIRED', 'CONFIG_FILE_UNREADABLE'].includes((error as { code?: string }).code ?? '')) throw error;
    return async (_text, signal) => { assertActive(signal); throw new BriefError('BRIEF_UNAVAILABLE'); };
  }
}
// Internal factory seam keeps configuration checks isolated from real credentials.
export async function configuredEvidence(createAdapter?: () => EvidenceTransport): Promise<SelectEvidence> {
  // Load the unchanged server transport at runtime so its .env URL is never a bundled asset.
  const moduleUrl = pathToFileURL(resolve(process.cwd(), 'back/ai/openai.mjs')).href;
  const { createOpenAIFromEnv } = await import(/* webpackIgnore: true */ moduleUrl);
  try { return createSelectEvidence((createAdapter ?? createOpenAIFromEnv)()); }
  catch (error) {
    if (!['CONFIG_REQUIRED', 'CONFIG_FILE_UNREADABLE'].includes((error as { code?: string }).code ?? '')) throw error;
    return async (_request, _profiles, signal) => { assertActive(signal); return { status: 'unavailable', reason: 'configuration' }; };
  }
}
// Share across route bundles in the same Node process, including failed attempts.
const processState = globalThis as typeof globalThis & { contractorServices?: ReturnType<typeof createServices> };
export const getServices = processState.contractorServices ??= createServices(resolve(process.cwd(), 'raw/dataset.csv'));
