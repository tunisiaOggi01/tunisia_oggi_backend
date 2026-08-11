import { SetMetadata } from '@nestjs/common';

/** Marks a route as exempt from the { success, data } response envelope (e.g. sitemap.xml). */
export const SKIP_ENVELOPE = 'skipEnvelope';
export const SkipEnvelope = () => SetMetadata(SKIP_ENVELOPE, true);
