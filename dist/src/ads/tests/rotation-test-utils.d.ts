export type Candidate = {
    id: string;
    impressions: number;
    maxImpressions: number | null;
};
export declare function mulberry32(seed: number): () => number;
export declare const ad: (id: string, maxImpressions: number | null, impressions?: number) => Candidate;
export declare function countWins(ads: Candidate[], iterations: number, seed: number): Record<string, number>;
export declare function expectShare(counts: Record<string, number>, id: string, share: number, total: number, tol: number): void;
