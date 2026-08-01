"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshThrottleGuard = void 0;
const common_1 = require("@nestjs/common");
const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 5;
const store = new Map();
setInterval(() => {
    const now = Date.now();
    for (const [k, v] of store)
        if (v.resetAt < now)
            store.delete(k);
}, 60_000);
let RefreshThrottleGuard = class RefreshThrottleGuard {
    canActivate(ctx) {
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
            throw new common_1.HttpException('Too many refresh attempts — try again later', common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        return true;
    }
};
exports.RefreshThrottleGuard = RefreshThrottleGuard;
exports.RefreshThrottleGuard = RefreshThrottleGuard = __decorate([
    (0, common_1.Injectable)()
], RefreshThrottleGuard);
//# sourceMappingURL=refresh-throttle.guard.js.map