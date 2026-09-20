export declare const CONCURRENT_ROTATION_GRACE_MS: number;
export declare function isConcurrentRotation(sibling: {
    createdAt: Date;
}, now?: number): boolean;
