import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './services/auth.service';
import { RefreshTokenService } from './services/refresh-token.service';
import { OtpService } from './services/otp.service';
import { AuthController } from './controllers/auth.controller';
import { OAuthController } from './controllers/oauth.controller';
import { SettingsController } from './controllers/settings.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CsrfGuard } from './guards/csrf.guard';
import { CaslAbilityFactory } from './casl/casl-ability.factory';
import { CaslGuard } from './casl/casl.guard';

/** Wires the auth feature together and exports its guards for use by every other feature module. */
@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: (process.env.JWT_EXPIRES_IN ?? '15m') as any },
    }),
  ],
  controllers: [AuthController, OAuthController, SettingsController],
  providers: [
    AuthService,
    RefreshTokenService,
    OtpService,
    GoogleStrategy,
    JwtAuthGuard,
    CsrfGuard,
    CaslAbilityFactory,
    CaslGuard,
  ],
  exports: [JwtAuthGuard, CsrfGuard, CaslGuard, CaslAbilityFactory, JwtModule],
})
export class AuthModule {}
