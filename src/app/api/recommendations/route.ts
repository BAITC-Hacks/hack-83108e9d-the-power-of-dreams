import { getServices } from '../../../../back/composition';
import { createHandlers } from '../../../../back/http/handlers';
export const runtime = 'nodejs';
export const POST = createHandlers(getServices).recommendations;
