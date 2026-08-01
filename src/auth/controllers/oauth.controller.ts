import { Controller, Get, Query, Req, Res, UseGuards, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

/** Google OAuth2 entry point and callback — sets the same cookies as email login. */
@Controller('auth')
export class OAuthController {
  private readonly logger = new Logger(OAuthController.name);

  constructor(private authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  google() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: Request, @Res() res: Response, @Query('redirect') redirect?: string) {
    try {
      const user = req.user as any;
      if (!user) {
        this.logger.error('googleCallback: req.user is undefined');
        return res.redirect(`${process.env.CORS_ORIGIN ?? 'http://localhost:5173'}/admin/login?error=oauth_failed`);
      }

      const { token, csrfToken, refreshToken } = await this.authService.issueTokens(user.id, user);

      const secure = process.env.NODE_ENV === 'production';
      res.cookie('access_token', token, { httpOnly: true, secure, sameSite: secure ? 'none' : 'lax', maxAge: 15 * 60 * 1000 });
      res.cookie('refresh_token', refreshToken, { httpOnly: true, secure, sameSite: secure ? 'none' : 'lax', path: '/auth/refresh', maxAge: 7 * 24 * 60 * 60 * 1000 });

      const frontendUrl = process.env.CORS_ORIGIN ?? 'http://localhost:5173';
      const redirectPath = redirect ? `?redirect=${encodeURIComponent(redirect)}&csrf=${csrfToken}` : `?csrf=${csrfToken}`;
      res.redirect(`${frontendUrl}/admin${redirectPath}`);
    } catch (err) {
      this.logger.error('googleCallback error', err instanceof Error ? err.message : err);
      res.redirect(`${process.env.CORS_ORIGIN ?? 'http://localhost:5173'}/admin/login?error=oauth_failed`);
    }
  }
}
