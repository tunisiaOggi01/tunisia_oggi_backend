"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicationsModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("../auth/auth.module");
const html_sanitizer_service_1 = require("../common/html-sanitizer.service");
const publications_admin_service_1 = require("./services/publications-admin.service");
const publications_reader_service_1 = require("./services/public/publications-reader.service");
const publications_interaction_service_1 = require("./services/public/publications-interaction.service");
const slug_service_1 = require("./services/slug.service");
const publications_admin_controller_1 = require("./controllers/publications-admin.controller");
const publications_public_controller_1 = require("./controllers/publications-public.controller");
let PublicationsModule = class PublicationsModule {
};
exports.PublicationsModule = PublicationsModule;
exports.PublicationsModule = PublicationsModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_1.AuthModule],
        controllers: [publications_admin_controller_1.PublicationsAdminController, publications_public_controller_1.PublicationsPublicController],
        providers: [
            publications_admin_service_1.PublicationsAdminService,
            publications_reader_service_1.PublicationsReaderService,
            publications_interaction_service_1.PublicationsInteractionService,
            slug_service_1.SlugService,
            html_sanitizer_service_1.HtmlSanitizerService,
        ],
    })
], PublicationsModule);
//# sourceMappingURL=publications.module.js.map