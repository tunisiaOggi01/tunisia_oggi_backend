export declare function pickWeighted<T extends {
    id: string;
    impressions: number;
    maxImpressions: number | null;
}>(ads: T[], limit: number, random?: () => number): T[];
