import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class RefreshThrottleGuard implements CanActivate {
    canActivate(ctx: ExecutionContext): boolean;
}
