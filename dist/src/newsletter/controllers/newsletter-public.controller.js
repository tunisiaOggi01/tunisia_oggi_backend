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
exports.NewsletterPublicController = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const newsletter_public_service_1 = require("../services/newsletter-public.service");
const newsletter_dto_1 = require("../dto/newsletter.dto");
let NewsletterPublicController = class NewsletterPublicController {
    newsletterPublicService;
    constructor(newsletterPublicService) {
        this.newsletterPublicService = newsletterPublicService;
    }
    subscribe(dto) {
        return this.newsletterPublicService.subscribe(dto);
    }
};
exports.NewsletterPublicController = NewsletterPublicController;
__decorate([
    (0, common_1.Post)('subscribe'),
    (0, common_1.HttpCode)(201),
    (0, throttler_1.Throttle)({ default: { limit: 5, ttl: (0, throttler_1.minutes)(1) } }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [newsletter_dto_1.SubscribeNewsletterDto]),
    __metadata("design:returntype", void 0)
], NewsletterPublicController.prototype, "subscribe", null);
exports.NewsletterPublicController = NewsletterPublicController = __decorate([
    (0, common_1.Controller)('public/newsletter'),
    __metadata("design:paramtypes", [newsletter_public_service_1.NewsletterPublicService])
], NewsletterPublicController);
//# sourceMappingURL=newsletter-public.controller.js.map