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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlugService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let SlugService = class SlugService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    slugify(title) {
        const slug = title
            .toLowerCase()
            .trim()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_]+/g, '-')
            .replace(/^-+|-+$/g, '');
        return slug || `article-${Date.now()}`;
    }
    async uniqueSlug(title, currentId) {
        const base = this.slugify(title);
        let slug = base;
        let suffix = 1;
        while (true) {
            const existing = await this.prisma.publication.findUnique({
                where: { slug },
            });
            if (!existing || (currentId && existing.id === currentId)) {
                break;
            }
            slug = `${base}-${suffix}`;
            suffix += 1;
        }
        return slug;
    }
};
exports.SlugService = SlugService;
exports.SlugService = SlugService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SlugService);
//# sourceMappingURL=slug.service.js.map