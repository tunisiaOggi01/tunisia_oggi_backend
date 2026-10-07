import {
  Controller,
  Get,
  Query,
  Req,
  Res,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { setAuthCookies } from '../auth-cookies';

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
  async googleCallback(
    @Req() req: Request,
    @Res() res: Response,
    @Query('redirect') redirect?: string,
  ) {
    try {
      const user = req.user as any;
      if (!user) {
        this.logger.error('googleCallback: req.user is undefined');
        return res.redirect(
          `${process.env.CORS_ORIGIN ?? 'http://localhost:5173'}/admin/login?error=oauth_failed`,
        );
      }

      const { token, csrfToken, refreshToken } =
        await this.authService.issueTokens(user.id, user);

      setAuthCookies(res, token, refreshToken);

      const frontendUrl = process.env.CORS_ORIGIN ?? 'http://localhost:5173';
      const redirectPath = redirect
        ? `?redirect=${encodeURIComponent(redirect)}&csrf=${csrfToken}`
        : `?csrf=${csrfToken}`;
      res.redirect(`${frontendUrl}/admin${redirectPath}`);
    } catch (err) {
      this.logger.error(
        'googleCallback error',
        err instanceof Error ? err.message : err,
      );
      res.redirect(
        `${process.env.CORS_ORIGIN ?? 'http://localhost:5173'}/admin/login?error=oauth_failed`,
      );
    }
  }
}
