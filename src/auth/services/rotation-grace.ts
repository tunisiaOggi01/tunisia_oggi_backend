/** How long a revoked token remains acceptable when a live sibling exists. */
export const CONCURRENT_ROTATION_GRACE_MS = 60 * 1000;

/** True when a live sibling was issued recently enough to be a concurrent tab rotation. */
export function isConcurrentRotation(
  sibling: { createdAt: Date },
  now: number = Date.now(),
): boolean {
  return now - sibling.createdAt.getTime() < CONCURRENT_ROTATION_GRACE_MS;
}
