import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';

interface Entry {
  count: number;
  resetAt: number;
}

const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 5;
const store = new Map<string, Entry>();

setInterval(() => {
  const now = Date.now();
  for (const [k, v] of store) if (v.resetAt < now) store.delete(k);
}, 60_000);

/** Per-IP rate limiter for the refresh endpoint: 5 requests per 60s. Prevents brute-force token rotation. */
@Injectable()
export class RefreshThrottleGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    const ip = req.ip ?? req.connection?.remoteAddress ?? 'unknown';
    const now = Date.now();
    const entry = store.get(ip);
    if (!entry || entry.resetAt < now) {
      store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
      return true;
    }
    entry.count++;
    if (entry.count > MAX_ATTEMPTS) {
      throw new HttpException('Too many refresh attempts — try again later', HttpStatus.TOO_MANY_REQUESTS);
    }
    return true;
  }
}
