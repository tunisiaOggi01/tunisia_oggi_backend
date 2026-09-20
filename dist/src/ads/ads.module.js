"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdsModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("../auth/auth.module");
const ads_public_service_1 = require("./services/ads-public.service");
const ads_admin_service_1 = require("./services/ads-admin.service");
const ads_public_controller_1 = require("./controllers/ads-public.controller");
const ads_admin_controller_1 = require("./controllers/ads-admin.controller");
let AdsModule = class AdsModule {
};
exports.AdsModule = AdsModule;
exports.AdsModule = AdsModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule],
        controllers: [ads_public_controller_1.AdsPublicController, ads_admin_controller_1.AdsAdminController],
        providers: [ads_public_service_1.AdsPublicService, ads_admin_service_1.AdsAdminService],
    })
], AdsModule);
//# sourceMappingURL=ads.module.js.map