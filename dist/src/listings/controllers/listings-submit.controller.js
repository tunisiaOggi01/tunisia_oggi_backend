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
exports.ListingsSubmitController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const csrf_guard_1 = require("../../auth/guards/csrf.guard");
const current_user_decorator_1 = require("../../auth/decorators/current-user.decorator");
const listings_public_service_1 = require("../services/public/listings-public.service");
const listings_tracking_service_1 = require("../services/public/listings-tracking.service");
const create_listing_dto_1 = require("../dto/create-listing.dto");
let ListingsSubmitController = class ListingsSubmitController {
    listingsPublicService;
    listingsTrackingService;
    constructor(listingsPublicService, listingsTrackingService) {
        this.listingsPublicService = listingsPublicService;
        this.listingsTrackingService = listingsTrackingService;
    }
    submit(dto, user) {
        return this.listingsPublicService.submit(dto, user.id);
    }
    getMine(user) {
        return this.listingsTrackingService.getMine(user.id);
    }
    getMineStats(id, user) {
        return this.listingsTrackingService.getMineStats(id, user.id);
    }
};
exports.ListingsSubmitController = ListingsSubmitController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, csrf_guard_1.CsrfGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_listing_dto_1.CreateListingDto, Object]),
    __metadata("design:returntype", void 0)
], ListingsSubmitController.prototype, "submit", null);
__decorate([
    (0, common_1.Get)('mine'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ListingsSubmitController.prototype, "getMine", null);
__decorate([
    (0, common_1.Get)('mine/:id/stats'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ListingsSubmitController.prototype, "getMineStats", null);
exports.ListingsSubmitController = ListingsSubmitController = __decorate([
    (0, common_1.Controller)('listings'),
    __metadata("design:paramtypes", [listings_public_service_1.ListingsPublicService,
        listings_tracking_service_1.ListingsTrackingService])
], ListingsSubmitController);
//# sourceMappingURL=listings-submit.controller.js.map