/**
 * Randomly picks up to `limit` ads, favouring candidates with more remaining
 * budget — exhausted ads still rotate but with minimal weight.
 * Stateless: no server state between draws.
 * @param random injectable RNG for deterministic tests (defaults to Math.random).
 */
export function pickWeighted<
  T extends { id: string; impressions: number; maxImpressions: number | null },
>(ads: T[], limit: number, random: () => number = Math.random): T[] {
  const pool = new Set(ads);
  const weight = (a: T) => {
    if (a.maxImpressions === null) return 1;
    const remaining = a.maxImpressions - a.impressions;
    return remaining > 0 ? remaining : 1;
  };

  const picked: T[] = [];
  while (picked.length < limit && pool.size > 0) {
    const list = [...pool];
    const total = list.reduce((sum, a) => sum + weight(a), 0);
    let draw = random() * total;
    let chosen = list[list.length - 1];
    for (const ad of list) {
      draw -= weight(ad);
      if (draw < 0) {
        chosen = ad;
        break;
      }
    }
    picked.push(chosen);
    pool.delete(chosen);
  }
  return picked;
}
