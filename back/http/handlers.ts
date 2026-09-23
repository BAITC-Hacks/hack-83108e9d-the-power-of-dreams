import { randomUUID } from 'node:crypto';
import type { CatalogLoadResult } from '../domain/types.ts';
import type { Recommend } from '../recommend/ports.ts';
import type { ErrorCode, RequestField } from '../../contracts/contractor-selection.ts';
import { InputError, normalize } from './normalize.ts';
import { BriefError } from '../ai/brief/interpret.ts';
import type { InterpretBrief } from '../ai/brief/interpret.ts';
export type Services = { catalog: CatalogLoadResult; recommend?: Recommend; interpretBrief?: InterpretBrief };
const json = (value: unknown, status = 200) => Response.json(value, { status, headers: { 'Cache-Control': 'no-store' } });
const messages: Record<ErrorCode, string> = { INVALID_REQUEST: 'Проверьте заполнение полей.', DATE_OUT_OF_RANGE: 'Выберите дату с 23 сентября по 31 декабря 2026 года.', CATALOG_UNAVAILABLE: 'Каталог временно недоступен. Попробуйте позже.', INTERNAL_ERROR: 'Не удалось выполнить подбор. Попробуйте ещё раз.', BRIEF_UNAVAILABLE: 'Не удалось разобрать пожелания. Повторите попытку или очистите необязательное поле.', BRIEF_INDEX_UNAVAILABLE: 'Сопоставление пожеланий с каталогом временно недоступно.' };
function failure(code: ErrorCode, requestId: string, field?: RequestField) {
  return json({ error: { code, message: messages[code], requestId, ...(field ? { fields: [{ field, message: messages[code] }] } : {}) } },
    ['CATALOG_UNAVAILABLE', 'BRIEF_UNAVAILABLE', 'BRIEF_INDEX_UNAVAILABLE'].includes(code) ? 503 : code === 'INTERNAL_ERROR' ? 500 : 400);
}
export function createHandlers(getServices: () => Promise<Services>) {
  return {
    async brief(request: Request) {
      const requestId = randomUUID();
      const active = () => { if (request.signal.aborted) throw new DOMException('Request cancelled', 'AbortError'); };
      try {
        active();
        let input: unknown;
        try { input = await request.json(); } catch { active(); return failure('INVALID_REQUEST', requestId, 'brief'); }
        active();
        if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).length !== 1 ||
          !('text' in input) || typeof input.text !== 'string' || !input.text.trim() || [...input.text].length > 1000) return failure('INVALID_REQUEST', requestId, 'brief');
        const { catalog, interpretBrief } = await getServices();
        active();
        if (catalog.status !== 'ready') return failure('CATALOG_UNAVAILABLE', requestId);
        if (!interpretBrief) return failure('BRIEF_UNAVAILABLE', requestId);
        const brief = await interpretBrief(input.text, request.signal);
        active();
        return json({ requestId, brief });
      } catch (error) {
        active();
        if ((error as Error).name === 'AbortError') throw error;
        return failure(error instanceof BriefError ? error.code : 'INTERNAL_ERROR', requestId);
      }
    },
    async options() {
      const requestId = randomUUID();
      try {
        const { catalog } = await getServices();
        if (catalog.status !== 'ready') return failure('CATALOG_UNAVAILABLE', requestId);
        return json({ requestId, context: { catalogVersion: catalog.snapshot.catalogVersion, selectionPolicyVersion: 'selection-v1' }, options: catalog.snapshot.options });
      } catch { return failure('INTERNAL_ERROR', requestId); }
    },
    async recommendations(request: Request) {
      const requestId = randomUUID();
      const active = () => { if (request.signal.aborted) throw new DOMException('Request cancelled', 'AbortError'); };
      try {
        active();
        let input: unknown;
        try { input = await request.json(); } catch { active(); return failure('INVALID_REQUEST', requestId); }
        active();
        const { catalog, recommend } = await getServices();
        active();
        if (catalog.status !== 'ready') return failure('CATALOG_UNAVAILABLE', requestId);
        const normalized = normalize(input, catalog.snapshot.options);
        if (!recommend) throw new Error('Missing composition');
        const result = await recommend(normalized, request.signal);
        active();
        return json({ requestId, ...result });
      } catch (error) {
        active();
        if ((error as Error).name === 'AbortError') throw error;
        if (error instanceof InputError) return failure(error.code, requestId, error.field);
        if ((error as { code?: string }).code === 'BRIEF_INDEX_UNAVAILABLE') return failure('BRIEF_INDEX_UNAVAILABLE', requestId);
        return failure('INTERNAL_ERROR', requestId);
      }
    },
  };
}
