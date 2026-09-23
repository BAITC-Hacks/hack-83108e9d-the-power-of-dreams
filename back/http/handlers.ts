import { randomUUID } from 'node:crypto';
import type { CatalogLoadResult } from '../domain/types.ts';
import type { Recommend } from '../recommend/ports.ts';
import type { ErrorCode, RequestField } from '../../contracts/contractor-selection.ts';
import { InputError, normalize } from './normalize.ts';
export type Services = { catalog: CatalogLoadResult; recommend?: Recommend };
const json = (value: unknown, status = 200) => Response.json(value, { status, headers: { 'Cache-Control': 'no-store' } });
const messages: Record<ErrorCode, string> = { INVALID_REQUEST: 'Проверьте заполнение полей.', DATE_OUT_OF_RANGE: 'Выберите дату с 23 сентября по 31 декабря 2026 года.', CATALOG_UNAVAILABLE: 'Каталог временно недоступен. Попробуйте позже.', INTERNAL_ERROR: 'Не удалось выполнить подбор. Попробуйте ещё раз.' };
function failure(code: ErrorCode, requestId: string, field?: RequestField) {
  return json({ error: { code, message: messages[code], requestId, ...(field ? { fields: [{ field, message: messages[code] }] } : {}) } },
    code === 'CATALOG_UNAVAILABLE' ? 503 : code === 'INTERNAL_ERROR' ? 500 : 400);
}
export function createHandlers(getServices: () => Promise<Services>) {
  return {
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
        return failure('INTERNAL_ERROR', requestId);
      }
    },
  };
}
