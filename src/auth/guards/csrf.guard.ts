import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

/** Double-submit CSRF check: the X-CSRF-Token header must match the csrf claim embedded in the session JWT. */
@Injectable()
export class CsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const header = request.headers['x-csrf-token'];
    if (!header || header !== request.csrfClaim) throw new ForbiddenException('Invalid CSRF token');
    return true;
  }
}
