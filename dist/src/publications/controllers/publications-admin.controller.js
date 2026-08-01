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
exports.PublicationsAdminController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const casl_guard_1 = require("../../auth/casl/casl.guard");
const csrf_guard_1 = require("../../auth/guards/csrf.guard");
const require_ability_decorator_1 = require("../../auth/decorators/require-ability.decorator");
const current_user_decorator_1 = require("../../auth/decorators/current-user.decorator");
const publications_admin_service_1 = require("../services/publications-admin.service");
const create_publication_dto_1 = require("../dto/create-publication.dto");
const update_publication_dto_1 = require("../dto/update-publication.dto");
const query_publications_dto_1 = require("../dto/query-publications.dto");
let PublicationsAdminController = class PublicationsAdminController {
    publicationsAdminService;
    constructor(publicationsAdminService) {
        this.publicationsAdminService = publicationsAdminService;
    }
    create(dto, user) {
        return this.publicationsAdminService.create(dto, user.id);
    }
    findById(id) {
        return this.publicationsAdminService.findById(id);
    }
    update(id, dto, user) {
        return this.publicationsAdminService.update(id, dto, user.id, user.role);
    }
    remove(id, user) {
        return this.publicationsAdminService.remove(id, user.id, user.role);
    }
    findAll(query) {
        return this.publicationsAdminService.findAll(query);
    }
    stats() {
        return this.publicationsAdminService.stats();
    }
};
exports.PublicationsAdminController = PublicationsAdminController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(csrf_guard_1.CsrfGuard),
    (0, require_ability_decorator_1.RequireAbility)('create', 'Publication'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_publication_dto_1.CreatePublicationDto, Object]),
    __metadata("design:returntype", void 0)
], PublicationsAdminController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, require_ability_decorator_1.RequireAbility)('read', 'Publication'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublicationsAdminController.prototype, "findById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(csrf_guard_1.CsrfGuard),
    (0, require_ability_decorator_1.RequireAbility)('update', 'Publication'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_publication_dto_1.UpdatePublicationDto, Object]),
    __metadata("design:returntype", void 0)
], PublicationsAdminController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(204),
    (0, common_1.UseGuards)(csrf_guard_1.CsrfGuard),
    (0, require_ability_decorator_1.RequireAbility)('delete', 'Publication'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PublicationsAdminController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(),
    (0, require_ability_decorator_1.RequireAbility)('read', 'Publication'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_publications_dto_1.QueryPublicationsDto]),
    __metadata("design:returntype", void 0)
], PublicationsAdminController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    (0, require_ability_decorator_1.RequireAbility)('read', 'Publication'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PublicationsAdminController.prototype, "stats", null);
exports.PublicationsAdminController = PublicationsAdminController = __decorate([
    (0, common_1.Controller)('admin/publications'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, casl_guard_1.CaslGuard),
    __metadata("design:paramtypes", [publications_admin_service_1.PublicationsAdminService])
], PublicationsAdminController);
//# sourceMappingURL=publications-admin.controller.js.map