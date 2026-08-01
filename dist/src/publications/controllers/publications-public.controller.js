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
exports.PublicationsPublicController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../auth/decorators/current-user.decorator");
const publications_reader_service_1 = require("../services/public/publications-reader.service");
const publications_interaction_service_1 = require("../services/public/publications-interaction.service");
const query_publications_dto_1 = require("../dto/query-publications.dto");
let PublicationsPublicController = class PublicationsPublicController {
    reader;
    interaction;
    constructor(reader, interaction) {
        this.reader = reader;
        this.interaction = interaction;
    }
    findPublished(query) {
        return this.reader.findPublished(query);
    }
    findTrending() {
        return this.reader.findTrending();
    }
    findBySlug(slug) {
        return this.reader.findBySlug(slug);
    }
    findRelated(slug) {
        return this.reader.findRelated(slug);
    }
    view(id, user) {
        return this.interaction.view(id, user.id);
    }
    react(id, type, user) {
        return this.interaction.react(id, user.id, type ?? 'LIKE');
    }
    unreact(id, user) {
        return this.interaction.unreact(id, user.id);
    }
};
exports.PublicationsPublicController = PublicationsPublicController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_publications_dto_1.QueryPublicationsDto]),
    __metadata("design:returntype", void 0)
], PublicationsPublicController.prototype, "findPublished", null);
__decorate([
    (0, common_1.Get)('trending'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PublicationsPublicController.prototype, "findTrending", null);
__decorate([
    (0, common_1.Get)(':slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublicationsPublicController.prototype, "findBySlug", null);
__decorate([
    (0, common_1.Get)(':slug/related'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PublicationsPublicController.prototype, "findRelated", null);
__decorate([
    (0, common_1.Post)(':id/view'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PublicationsPublicController.prototype, "view", null);
__decorate([
    (0, common_1.Post)(':id/react'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('type')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], PublicationsPublicController.prototype, "react", null);
__decorate([
    (0, common_1.Delete)(':id/react'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PublicationsPublicController.prototype, "unreact", null);
exports.PublicationsPublicController = PublicationsPublicController = __decorate([
    (0, common_1.Controller)('publications'),
    __metadata("design:paramtypes", [publications_reader_service_1.PublicationsReaderService,
        publications_interaction_service_1.PublicationsInteractionService])
], PublicationsPublicController);
//# sourceMappingURL=publications-public.controller.js.map