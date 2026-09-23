import { getServices } from '../../../../../back/composition';
import { createHandlers } from '../../../../../back/http/handlers';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const GET = createHandlers(getServices).options;
