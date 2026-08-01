"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const auth_service_1 = require("./services/auth.service");
const refresh_token_service_1 = require("./services/refresh-token.service");
const otp_service_1 = require("./services/otp.service");
const auth_controller_1 = require("./controllers/auth.controller");
const oauth_controller_1 = require("./controllers/oauth.controller");
const google_strategy_1 = require("./strategies/google.strategy");
const jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
const csrf_guard_1 = require("./guards/csrf.guard");
const casl_ability_factory_1 = require("./casl/casl-ability.factory");
const casl_guard_1 = require("./casl/casl.guard");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: (process.env.JWT_EXPIRES_IN ?? '15m') },
            }),
        ],
        controllers: [auth_controller_1.AuthController, oauth_controller_1.OAuthController],
        providers: [auth_service_1.AuthService, refresh_token_service_1.RefreshTokenService, otp_service_1.OtpService, google_strategy_1.GoogleStrategy, jwt_auth_guard_1.JwtAuthGuard, csrf_guard_1.CsrfGuard, casl_ability_factory_1.CaslAbilityFactory, casl_guard_1.CaslGuard],
        exports: [jwt_auth_guard_1.JwtAuthGuard, csrf_guard_1.CsrfGuard, casl_guard_1.CaslGuard, casl_ability_factory_1.CaslAbilityFactory, jwt_1.JwtModule],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map