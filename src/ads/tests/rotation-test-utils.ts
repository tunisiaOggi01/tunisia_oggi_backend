import { pickWeighted } from '../services/rotation';

export type Candidate = {
  id: string;
  impressions: number;
  maxImpressions: number | null;
};

/** Deterministic PRNG (mulberry32) so distribution tests never flake. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const ad = (
  id: string,
  maxImpressions: number | null,
  impressions = 0,
): Candidate => ({
  id,
  impressions,
  maxImpressions,
});

/** Counts single-slot winners over `iterations` seeded draws. */
export function countWins(
  ads: Candidate[],
  iterations: number,
  seed: number,
): Record<string, number> {
  const random = mulberry32(seed);
  const counts: Record<string, number> = {};
  for (let i = 0; i < iterations; i++) {
    const winner = pickWeighted(ads, 1, random)[0];
    counts[winner.id] = (counts[winner.id] ?? 0) + 1;
  }
  return counts;
}

/** Asserts id's share of total draws stays within ±tol. */
export function expectShare(
  counts: Record<string, number>,
  id: string,
  share: number,
  total: number,
  tol: number,
) {
  expect(counts[id]).toBeGreaterThan(total * share * (1 - tol));
  expect(counts[id]).toBeLessThan(total * share * (1 + tol));
}
