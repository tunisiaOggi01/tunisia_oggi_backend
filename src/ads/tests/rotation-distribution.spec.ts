import { pickWeighted } from '../services/rotation';
import { ad, countWins, expectShare, mulberry32 } from './rotation-test-utils';

describe('pickWeighted distribution', () => {
  it('wins proportionally to remaining budget (40/20/10 over 70k draws)', () => {
    const counts = countWins(
      [ad('big', 40), ad('mid', 20), ad('small', 10)],
      70000,
      42,
    );
    expectShare(counts, 'big', 40 / 70, 70000, 0.02);
    expectShare(counts, 'mid', 20 / 70, 70000, 0.02);
    expectShare(counts, 'small', 10 / 70, 70000, 0.02);
  });

  it('draws uniformly when budgets are equal', () => {
    const counts = countWins(
      [ad('a', 100), ad('b', 100), ad('c', 100)],
      30000,
      7,
    );
    expectShare(counts, 'a', 1 / 3, 30000, 0.03);
    expectShare(counts, 'b', 1 / 3, 30000, 0.03);
    expectShare(counts, 'c', 1 / 3, 30000, 0.03);
  });

  it('lets an unlimited ad compete at weight 1 against a 50-remaining budget', () => {
    const counts = countWins(
      [ad('unlimited', null), ad('budgeted', 100, 50)],
      51000,
      99,
    );
    expectShare(counts, 'budgeted', 50 / 51, 51000, 0.02);
    expect(counts.unlimited).toBeGreaterThan(800);
  });

  it('draws limit distinct ads and keeps the first slot weighted', () => {
    const random = mulberry32(3);
    const ads = [ad('a', 60), ad('b', 30), ad('c', 10)];
    let distinctFailures = 0;
    let aFirst = 0;
    const iterations = 5000;
    for (let i = 0; i < iterations; i++) {
      const picked = pickWeighted(ads, 3, random);
      if (new Set(picked.map((p) => p.id)).size !== 3) distinctFailures++;
      if (picked[0].id === 'a') aFirst++;
    }
    expect(distinctFailures).toBe(0);
    expectShare(
      { a: aFirst, b: iterations - aFirst },
      'a',
      0.6,
      iterations,
      0.02,
    );
  });

  it('keeps exhausted ads in rotation alongside unlimited ads', () => {
    const random = mulberry32(11);
    const budget = 4;
    const limited = ad('limited', budget);
    const endless = ad('endless', null);
    const ads = [limited, endless];
    const seenAfterExhaustion = new Set<string>();
    let exhausted = false;
    for (let i = 0; i < 200; i++) {
      const picked = pickWeighted(ads, 1, random);
      if (exhausted) seenAfterExhaustion.add(picked[0].id);
      const winner = ads.find((a) => a.id === picked[0].id);
      if (winner) winner.impressions++;
      if (!exhausted && limited.impressions >= budget) exhausted = true;
    }
    expect(exhausted).toBe(true);
    expect(seenAfterExhaustion.has('limited')).toBe(true);
    expect(seenAfterExhaustion.has('endless')).toBe(true);
  });

  it('always picks the single candidate regardless of the draw', () => {
    const random = mulberry32(5);
    for (let i = 0; i < 100; i++) {
      expect(pickWeighted([ad('only', 1)], 1, random).map((a) => a.id)).toEqual(
        ['only'],
      );
    }
  });
});
