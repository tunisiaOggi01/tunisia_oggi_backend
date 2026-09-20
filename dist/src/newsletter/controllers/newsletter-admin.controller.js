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
exports.NewsletterAdminController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const casl_guard_1 = require("../../auth/casl/casl.guard");
const csrf_guard_1 = require("../../auth/guards/csrf.guard");
const require_ability_decorator_1 = require("../../auth/decorators/require-ability.decorator");
const newsletter_admin_service_1 = require("../services/newsletter-admin.service");
const newsletter_dto_1 = require("../dto/newsletter.dto");
let NewsletterAdminController = class NewsletterAdminController {
    newsletterAdminService;
    constructor(newsletterAdminService) {
        this.newsletterAdminService = newsletterAdminService;
    }
    findAll(query) {
        return this.newsletterAdminService.findAll(query);
    }
    stats() {
        return this.newsletterAdminService.stats();
    }
    softDelete(id) {
        return this.newsletterAdminService.softDelete(id);
    }
    async exportCsv(res) {
        const csv = await this.newsletterAdminService.exportCsv();
        res.set({
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': 'attachment; filename="subscribers.csv"',
        });
        res.send(csv);
    }
};
exports.NewsletterAdminController = NewsletterAdminController;
__decorate([
    (0, common_1.Get)('subscribers'),
    (0, require_ability_decorator_1.RequireAbility)('read', 'Newsletter'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [newsletter_dto_1.QuerySubscribersDto]),
    __metadata("design:returntype", void 0)
], NewsletterAdminController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, require_ability_decorator_1.RequireAbility)('read', 'Newsletter'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NewsletterAdminController.prototype, "stats", null);
__decorate([
    (0, common_1.Delete)('subscribers/:id'),
    (0, common_1.HttpCode)(204),
    (0, common_1.UseGuards)(csrf_guard_1.CsrfGuard),
    (0, require_ability_decorator_1.RequireAbility)('delete', 'Newsletter'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NewsletterAdminController.prototype, "softDelete", null);
__decorate([
    (0, common_1.Get)('export'),
    (0, require_ability_decorator_1.RequireAbility)('read', 'Newsletter'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NewsletterAdminController.prototype, "exportCsv", null);
exports.NewsletterAdminController = NewsletterAdminController = __decorate([
    (0, common_1.Controller)('admin/newsletter'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, casl_guard_1.CaslGuard),
    __metadata("design:paramtypes", [newsletter_admin_service_1.NewsletterAdminService])
], NewsletterAdminController);
//# sourceMappingURL=newsletter-admin.controller.js.map