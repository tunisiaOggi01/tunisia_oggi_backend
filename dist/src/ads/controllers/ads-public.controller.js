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
exports.AdsPublicController = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const skip_envelope_decorator_1 = require("../../common/skip-envelope.decorator");
const ads_public_service_1 = require("../services/ads-public.service");
const ads_dto_1 = require("../dto/ads.dto");
let AdsPublicController = class AdsPublicController {
    adsPublicService;
    constructor(adsPublicService) {
        this.adsPublicService = adsPublicService;
    }
    async findActive(query) {
        return this.adsPublicService.findActive(query);
    }
    trackImpression(id, ip) {
        return this.adsPublicService.trackImpression(id, ip);
    }
    trackClick(id, ip) {
        return this.adsPublicService.trackClick(id, ip);
    }
};
exports.AdsPublicController = AdsPublicController;
__decorate([
    (0, common_1.Get)(),
    (0, skip_envelope_decorator_1.SkipEnvelope)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ads_dto_1.QueryActiveAdsDto]),
    __metadata("design:returntype", Promise)
], AdsPublicController.prototype, "findActive", null);
__decorate([
    (0, common_1.Post)(':id/impression'),
    (0, skip_envelope_decorator_1.SkipEnvelope)(),
    (0, common_1.HttpCode)(201),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: (0, throttler_1.minutes)(1) } }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdsPublicController.prototype, "trackImpression", null);
__decorate([
    (0, common_1.Post)(':id/click'),
    (0, skip_envelope_decorator_1.SkipEnvelope)(),
    (0, common_1.HttpCode)(201),
    (0, throttler_1.Throttle)({ default: { limit: 10, ttl: (0, throttler_1.minutes)(1) } }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AdsPublicController.prototype, "trackClick", null);
exports.AdsPublicController = AdsPublicController = __decorate([
    (0, common_1.Controller)('public/ads'),
    __metadata("design:paramtypes", [ads_public_service_1.AdsPublicService])
], AdsPublicController);
//# sourceMappingURL=ads-public.controller.js.map