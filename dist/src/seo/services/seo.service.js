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
exports.SeoService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const STATIC_PAGES = ['', 'directory', 'search'];
let SeoService = class SeoService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    get baseUrl() {
        return process.env.APP_URL ?? 'http://localhost:3000';
    }
    robots() {
        const base = this.baseUrl;
        return [
            'User-agent: *',
            'Disallow: /admin',
            'Disallow: /profile',
            `Sitemap: ${base}/seo/sitemap.xml`,
            '',
        ].join('\n');
    }
    async sitemap() {
        const base = this.baseUrl;
        const published = await this.prisma.publication.findMany({
            where: { status: 'PUBLISHED' },
            select: { slug: true, updatedAt: true },
            orderBy: { updatedAt: 'desc' },
        });
        const urls = STATIC_PAGES.map((path) => ({
            loc: `${base}/${path}`,
            lastmod: new Date().toISOString().slice(0, 10),
        }));
        urls.push(...published.map((p) => ({
            loc: `${base}/article/${p.slug}`,
            lastmod: p.updatedAt.toISOString().slice(0, 10),
        })));
        const body = urls
            .map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n  </url>`)
            .join('\n');
        return [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
            body,
            '</urlset>',
            '',
        ].join('\n');
    }
};
exports.SeoService = SeoService;
exports.SeoService = SeoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SeoService);
//# sourceMappingURL=seo.service.js.map