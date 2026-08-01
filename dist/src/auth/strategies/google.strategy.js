"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var GoogleStrategy_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const auth_service_1 = require("../services/auth.service");
let GoogleStrategy = GoogleStrategy_1 = class GoogleStrategy extends (0, passport_1.PassportStrategy)(passport_google_oauth20_1.Strategy, 'google') {
    authService;
    logger = new common_1.Logger(GoogleStrategy_1.name);
    constructor(authService) {
        const clientID = process.env.GOOGLE_CLIENT_ID ?? '';
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET ?? '';
        const callbackURL = process.env.GOOGLE_CALLBACK_URL ?? '';
        if (!clientID || !clientSecret || !callbackURL) {
            common_1.Logger.warn(`Google OAuth misconfigured: GOOGLE_CLIENT_ID=${!!clientID} GOOGLE_CLIENT_SECRET=${!!clientSecret} GOOGLE_CALLBACK_URL=${!!callbackURL}`);
        }
        super({ clientID, clientSecret, callbackURL, scope: ['email', 'profile'] });
        this.authService = authService;
    }
    async validate(accessToken, refreshToken, profile, done) {
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
        }
        catch (err) {
            this.logger.error('validate error', err instanceof Error ? err.message : err);
            done(err, undefined);
        }
    }
};
exports.GoogleStrategy = GoogleStrategy;
exports.GoogleStrategy = GoogleStrategy = GoogleStrategy_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], GoogleStrategy);
//# sourceMappingURL=google.strategy.js.map