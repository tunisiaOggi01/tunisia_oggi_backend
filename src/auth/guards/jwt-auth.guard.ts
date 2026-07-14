import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

/** Verifies the access_token cookie and attaches the decoded user + csrf claim to the request. */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.access_token;
    if (!token) throw new UnauthorizedException('No session cookie');

    try {
      const payload = this.jwtService.verify(token);
      request.user = { id: payload.sub, email: payload.email, username: payload.username, role: payload.role };
      request.csrfClaim = payload.csrf;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired session');
    }
  }
}
