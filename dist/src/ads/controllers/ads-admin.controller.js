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
exports.AdsAdminController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const casl_guard_1 = require("../../auth/casl/casl.guard");
const csrf_guard_1 = require("../../auth/guards/csrf.guard");
const require_ability_decorator_1 = require("../../auth/decorators/require-ability.decorator");
const current_user_decorator_1 = require("../../auth/decorators/current-user.decorator");
const ads_admin_service_1 = require("../services/ads-admin.service");
const ads_dto_1 = require("../dto/ads.dto");
let AdsAdminController = class AdsAdminController {
    adsAdminService;
    constructor(adsAdminService) {
        this.adsAdminService = adsAdminService;
    }
    findAll(query) {
        return this.adsAdminService.findAll(query);
    }
    stats() {
        return this.adsAdminService.stats();
    }
    findLogs(query) {
        return this.adsAdminService.findLogs(query);
    }
    create(dto, user) {
        return this.adsAdminService.create(dto, user);
    }
    update(id, dto, user) {
        return this.adsAdminService.update(id, dto, user);
    }
    remove(id, user) {
        return this.adsAdminService.remove(id, user);
    }
};
exports.AdsAdminController = AdsAdminController;
__decorate([
    (0, common_1.Get)(),
    (0, require_ability_decorator_1.RequireAbility)('read', 'Advertisement'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ads_dto_1.QueryAdsDto]),
    __metadata("design:returntype", void 0)
], AdsAdminController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, require_ability_decorator_1.RequireAbility)('read', 'Advertisement'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdsAdminController.prototype, "stats", null);
__decorate([
    (0, common_1.Get)('logs'),
    (0, require_ability_decorator_1.RequireAbility)('read', 'Advertisement'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ads_dto_1.QueryAdLogsDto]),
    __metadata("design:returntype", void 0)
], AdsAdminController.prototype, "findLogs", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(csrf_guard_1.CsrfGuard),
    (0, require_ability_decorator_1.RequireAbility)('create', 'Advertisement'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ads_dto_1.CreateAdDto, Object]),
    __metadata("design:returntype", void 0)
], AdsAdminController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(csrf_guard_1.CsrfGuard),
    (0, require_ability_decorator_1.RequireAbility)('update', 'Advertisement'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, ads_dto_1.UpdateAdDto, Object]),
    __metadata("design:returntype", void 0)
], AdsAdminController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(204),
    (0, common_1.UseGuards)(csrf_guard_1.CsrfGuard),
    (0, require_ability_decorator_1.RequireAbility)('delete', 'Advertisement'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdsAdminController.prototype, "remove", null);
exports.AdsAdminController = AdsAdminController = __decorate([
    (0, common_1.Controller)('admin/ads'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, casl_guard_1.CaslGuard),
    __metadata("design:paramtypes", [ads_admin_service_1.AdsAdminService])
], AdsAdminController);
//# sourceMappingURL=ads-admin.controller.js.map