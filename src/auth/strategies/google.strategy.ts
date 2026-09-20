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

    super({ clientID, clientSecret, callbackURL, scope: ['email', 'profile'] });
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
