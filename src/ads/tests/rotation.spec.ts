import { pickWeighted } from '../services/rotation';

type Candidate = {
  id: string;
  impressions: number;
  maxImpressions: number | null;
};

const A: Candidate = { id: 'a', impressions: 0, maxImpressions: 8 };
const B: Candidate = { id: 'b', impressions: 0, maxImpressions: 5 };
const C: Candidate = { id: 'c', impressions: 0, maxImpressions: null };

describe('pickWeighted', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('picks the dominant-budget ad when the random draw is ~0', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.001);
    const picked = pickWeighted([A, B, C], 1);
    expect(picked.map((a) => a.id)).toEqual(['a']);
  });

  it('rotates to a different ad on a high draw', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.999);
    const picked = pickWeighted([A, B, C], 1);
    expect(picked.map((a) => a.id)).toEqual(['c']);
  });

  it('includes exhausted ads in rotation with weight 1', () => {
    const exhausted: Candidate = { id: 'x', impressions: 8, maxImpressions: 8 };
    jest.spyOn(Math, 'random').mockReturnValue(0.001);
    const picked = pickWeighted([exhausted, C], 1).map((a) => a.id);
    expect(picked).toContain('x');
  });

  it('returns up to limit distinct ads when drawing without replacement', () => {
    const picked = pickWeighted([A, B, C], 3);
    expect(picked).toHaveLength(3);
    expect(new Set(picked.map((a) => a.id)).size).toBe(3);
  });

  it('caps the draw at the number of eligible ads', () => {
    expect(pickWeighted([A], 3)).toHaveLength(1);
  });

  it('returns an empty array when no active candidates exist', () => {
    expect(pickWeighted([], 1)).toEqual([]);
  });
});
