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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var OAuthController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const auth_service_1 = require("../services/auth.service");
let OAuthController = OAuthController_1 = class OAuthController {
    authService;
    logger = new common_1.Logger(OAuthController_1.name);
    constructor(authService) {
        this.authService = authService;
    }
    google() { }
    async googleCallback(req, res, redirect) {
        try {
            const user = req.user;
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
        }
        catch (err) {
            this.logger.error('googleCallback error', err instanceof Error ? err.message : err);
            res.redirect(`${process.env.CORS_ORIGIN ?? 'http://localhost:5173'}/admin/login?error=oauth_failed`);
        }
    }
};
exports.OAuthController = OAuthController;
__decorate([
    (0, common_1.Get)('google'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OAuthController.prototype, "google", null);
__decorate([
    (0, common_1.Get)('google/callback'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('google')),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Query)('redirect')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], OAuthController.prototype, "googleCallback", null);
exports.OAuthController = OAuthController = OAuthController_1 = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], OAuthController);
//# sourceMappingURL=oauth.controller.js.map