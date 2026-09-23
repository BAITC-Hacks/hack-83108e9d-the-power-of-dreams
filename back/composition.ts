import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { loadCatalog } from './catalog/load.ts';
import { select } from './domain/select.ts';
import { createRecommend } from './recommend/recommend.ts';
import { createSelectEvidence, assertActive } from './ai/evidence/select.ts';
import type { SelectEvidence } from './recommend/ports.ts';
import type { Services } from './http/handlers.ts';
import type { LoadCatalog } from './domain/types.ts';

export function createServices(path: string, load: LoadCatalog = loadCatalog, evidenceFactory: () => SelectEvidence | Promise<SelectEvidence> = configuredEvidence) {
  let retained: Promise<Services> | undefined;
  return () => retained ??= (async () => {
    const catalog = await load(path);
    if (catalog.status !== 'ready') return { catalog };
    return { catalog, recommend: createRecommend(catalog.snapshot, select, await evidenceFactory()) };
  })();
}
async function configuredEvidence(): Promise<SelectEvidence> {
  // Load the unchanged server transport at runtime so its .env URL is never a bundled asset.
  const moduleUrl = pathToFileURL(resolve(process.cwd(), 'back/ai/openai.mjs')).href;
  const { createOpenAIFromEnv } = await import(/* webpackIgnore: true */ moduleUrl);
  try { return createSelectEvidence(createOpenAIFromEnv()); }
  catch (error) {
    if (!['CONFIG_REQUIRED', 'CONFIG_FILE_UNREADABLE'].includes((error as { code?: string }).code ?? '')) throw error;
    return async (_request, _profiles, signal) => { assertActive(signal); return { status: 'unavailable', reason: 'configuration' }; };
  }
}
// Share across route bundles in the same Node process, including failed attempts.
const processState = globalThis as typeof globalThis & { contractorServices?: ReturnType<typeof createServices> };
export const getServices = processState.contractorServices ??= createServices(resolve(process.cwd(), 'raw/dataset.csv'));
