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
exports.SearchPublicController = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
const search_public_service_1 = require("../services/search-public.service");
const search_dto_1 = require("../dto/search.dto");
let SearchPublicController = class SearchPublicController {
    searchPublicService;
    constructor(searchPublicService) {
        this.searchPublicService = searchPublicService;
    }
    search(query) {
        return this.searchPublicService.search(query);
    }
};
exports.SearchPublicController = SearchPublicController;
__decorate([
    (0, common_1.Get)(),
    (0, throttler_1.Throttle)({ default: { limit: 20, ttl: (0, throttler_1.minutes)(1) } }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_dto_1.QuerySearchDto]),
    __metadata("design:returntype", void 0)
], SearchPublicController.prototype, "search", null);
exports.SearchPublicController = SearchPublicController = __decorate([
    (0, common_1.Controller)('public/search'),
    __metadata("design:paramtypes", [search_public_service_1.SearchPublicService])
], SearchPublicController);
//# sourceMappingURL=search-public.controller.js.map