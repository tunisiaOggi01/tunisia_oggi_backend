import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../services/auth.service';

/** Passport Google OAuth2 strategy — redirects to Google consent, then handles the callback. */
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor(private authService: AuthService) {
    const clientID = process.env.GOOGLE_CLIENT_ID ?? '';
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET ?? '';
    const callbackURL = process.env.GOOGLE_CALLBACK_URL ?? '';

    if (!clientID || !clientSecret || !callbackURL) {
      Logger.warn(
        `Google OAuth misconfigured: GOOGLE_CLIENT_ID=${!!clientID} GOOGLE_CLIENT_SECRET=${!!clientSecret} GOOGLE_CALLBACK_URL=${!!callbackURL}`,
      );
    }

    // passport-oauth2 throws on an empty clientID, which would crash the whole app at boot;
    // a placeholder keeps the API up and only Google login fails until the env vars are set.
    super({
      clientID: clientID || 'not-configured',
      clientSecret: clientSecret || 'not-configured',
      callbackURL: callbackURL || '/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    try {
      const { id, emails, photos } = profile;
      const email = emails?.[0]?.value;
      if (!email)
        return done(new Error('Google account has no email'), undefined);

      const user = await this.authService.handleGoogleLogin({
        googleId: id,
        email,
        username: email.split('@')[0],
        imageUrl: photos?.[0]?.value ?? null,
      });

      done(null, user);
    } catch (err) {
      this.logger.error(
        'validate error',
        err instanceof Error ? err.message : err,
      );
      done(err as Error, undefined);
    }
  }
}
