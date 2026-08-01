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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const auth_service_1 = require("../services/auth.service");
const refresh_token_service_1 = require("../services/refresh-token.service");
const auth_dto_1 = require("../dto/auth.dto");
const password_reset_dto_1 = require("../dto/password-reset.dto");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const refresh_throttle_guard_1 = require("../guards/refresh-throttle.guard");
const current_user_decorator_1 = require("../decorators/current-user.decorator");
let AuthController = class AuthController {
    authService;
    refreshTokenService;
    constructor(authService, refreshTokenService) {
        this.authService = authService;
        this.refreshTokenService = refreshTokenService;
    }
    setCookies(res, token, refreshToken) {
        const secure = process.env.NODE_ENV === 'production';
        res.cookie('access_token', token, { httpOnly: true, secure, sameSite: secure ? 'none' : 'lax', maxAge: 15 * 60 * 1000 });
        res.cookie('refresh_token', refreshToken, { httpOnly: true, secure, sameSite: secure ? 'none' : 'lax', path: '/auth/refresh', maxAge: 7 * 24 * 60 * 60 * 1000 });
    }
    async login(dto, res) {
        const result = await this.authService.validateAndLogin(dto.email, dto.password);
        this.setCookies(res, result.token, result.refreshToken);
        return { user: result.user, csrfToken: result.csrfToken };
    }
    async register(dto, res) {
        const result = await this.authService.register(dto.email, dto.username, dto.password);
        this.setCookies(res, result.token, result.refreshToken);
        return { user: result.user, csrfToken: result.csrfToken };
    }
    async updateProfile(user, dto) {
        return this.authService.updateProfile(user.id, dto);
    }
    async updateHeardAbout(user, dto) {
        return this.authService.updateHeardAbout(user.id, dto.source);
    }
    async me(user, req) {
        const profile = await this.authService.getProfile(user.id);
        return { user: profile, csrfToken: req.csrfClaim };
    }
    async forgotPassword(dto) {
        return this.authService.forgotPassword(dto.email);
    }
    async resetPassword(dto) {
        await this.authService.resetPassword(dto.email, dto.otpCode, dto.newPassword);
        return { message: 'Password has been reset successfully.' };
    }
    async refresh(req, res) {
        const raw = req.cookies?.refresh_token;
        if (!raw)
            return { success: false, error: 'No refresh token' };
        const { accessToken, csrfToken, newRefreshToken } = await this.refreshTokenService.rotate(raw);
        this.setCookies(res, accessToken, newRefreshToken);
        return { csrfToken };
    }
    async logout(req, res) {
        const raw = req.cookies?.refresh_token;
        if (raw)
            await this.refreshTokenService.revoke(raw);
        res.clearCookie('access_token');
        res.clearCookie('refresh_token', { path: '/auth/refresh' });
        return { success: true };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(200),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: (0, throttler_1.minutes)(1) } }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.HttpCode)(201),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.RegisterDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Patch)('profile'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(200),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_dto_1.UpdateProfileDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Patch)('heard-about'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(200),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_dto_1.HeardAboutDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "updateHeardAbout", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(200),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "me", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, common_1.HttpCode)(200),
    (0, throttler_1.Throttle)({ default: { limit: 3, ttl: (0, throttler_1.minutes)(5) } }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [password_reset_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, common_1.HttpCode)(200),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: (0, throttler_1.minutes)(1) } }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [password_reset_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, common_1.UseGuards)(refresh_throttle_guard_1.RefreshThrottleGuard),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService, refresh_token_service_1.RefreshTokenService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map