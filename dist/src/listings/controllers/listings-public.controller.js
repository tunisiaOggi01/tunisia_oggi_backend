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
exports.ListingsPublicController = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const listings_public_service_1 = require("../services/public/listings-public.service");
const listings_tracking_service_1 = require("../services/public/listings-tracking.service");
const query_listings_dto_1 = require("../dto/query-listings.dto");
const click_action_dto_1 = require("../dto/tracking/click-action.dto");
let ListingsPublicController = class ListingsPublicController {
    listingsPublicService;
    listingsTrackingService;
    constructor(listingsPublicService, listingsTrackingService) {
        this.listingsPublicService = listingsPublicService;
        this.listingsTrackingService = listingsTrackingService;
    }
    async findApproved(query) {
        return this.listingsPublicService.findApproved(query);
    }
    findById(id, ip) {
        return this.listingsTrackingService.findById(id, ip);
    }
    trackClick(id, dto) {
        return this.listingsTrackingService.trackClick(id, dto.action);
    }
};
exports.ListingsPublicController = ListingsPublicController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_listings_dto_1.QueryListingsDto]),
    __metadata("design:returntype", Promise)
], ListingsPublicController.prototype, "findApproved", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ListingsPublicController.prototype, "findById", null);
__decorate([
    (0, common_1.Post)(':id/click'),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: (0, throttler_1.minutes)(1) } }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, click_action_dto_1.ClickActionDto]),
    __metadata("design:returntype", void 0)
], ListingsPublicController.prototype, "trackClick", null);
exports.ListingsPublicController = ListingsPublicController = __decorate([
    (0, common_1.Controller)('public/listings'),
    __metadata("design:paramtypes", [listings_public_service_1.ListingsPublicService,
        listings_tracking_service_1.ListingsTrackingService])
], ListingsPublicController);
//# sourceMappingURL=listings-public.controller.js.map