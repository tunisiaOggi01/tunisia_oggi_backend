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
exports.SettingsController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../services/auth.service");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const csrf_guard_1 = require("../guards/csrf.guard");
const current_user_decorator_1 = require("../decorators/current-user.decorator");
const settings_dto_1 = require("../dto/settings.dto");
let SettingsController = class SettingsController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async changeUsername(user, dto) {
        return this.authService.changeUsername(user.id, dto.username);
    }
    async changeEmail(user, dto) {
        return this.authService.changeEmail(user.id, dto.email);
    }
    async changePassword(user, dto) {
        return this.authService.changePassword(user.id, dto.currentPassword, dto.newPassword);
    }
};
exports.SettingsController = SettingsController;
__decorate([
    (0, common_1.Patch)('username'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, csrf_guard_1.CsrfGuard),
    (0, common_1.HttpCode)(200),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, settings_dto_1.ChangeUsernameDto]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "changeUsername", null);
__decorate([
    (0, common_1.Patch)('email'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, csrf_guard_1.CsrfGuard),
    (0, common_1.HttpCode)(200),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, settings_dto_1.ChangeEmailDto]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "changeEmail", null);
__decorate([
    (0, common_1.Patch)('password'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, csrf_guard_1.CsrfGuard),
    (0, common_1.HttpCode)(200),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, settings_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], SettingsController.prototype, "changePassword", null);
exports.SettingsController = SettingsController = __decorate([
    (0, common_1.Controller)('auth/settings'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], SettingsController);
//# sourceMappingURL=settings.controller.js.map