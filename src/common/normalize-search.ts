/**
 * Normalizes text for accent- and case-insensitive matching: lowercase, NFD-stripped of
 * diacritics, trimmed. Fed into the `searchText` columns at write time by feature services.
 */
export function normalizeSearchText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}
