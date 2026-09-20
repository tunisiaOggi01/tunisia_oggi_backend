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
exports.PublicationsAdminService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const html_sanitizer_service_1 = require("../../common/html-sanitizer.service");
const slug_service_1 = require("./slug.service");
const normalize_search_1 = require("../../common/normalize-search");
let PublicationsAdminService = class PublicationsAdminService {
    prisma;
    slugService;
    sanitizer;
    constructor(prisma, slugService, sanitizer) {
        this.prisma = prisma;
        this.slugService = slugService;
        this.sanitizer = sanitizer;
    }
    async create(dto, authorId) {
        const slug = await this.slugService.uniqueSlug(dto.title);
        const publishedAt = dto.status === 'PUBLISHED' ? new Date() : null;
        const rankScore = publishedAt ? 1 / Math.pow(2, 1.5) : 0;
        const cleanTitle = this.sanitizer.sanitize(dto.title);
        const cleanBody = this.sanitizer.sanitize(dto.body);
        const publication = await this.prisma.publication.create({
            data: {
                title: cleanTitle,
                slug,
                body: cleanBody,
                searchText: (0, normalize_search_1.normalizeSearchText)(`${cleanTitle} ${cleanBody}`),
                categoryId: dto.categoryId,
                featuredImageUrl: dto.featuredImageUrl,
                tags: dto.tags ?? [],
                status: dto.status,
                scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
                publishedAt,
                rankScore,
                authorId,
            },
        });
        if (dto.featuredImageUrl) {
            await this.prisma.pendingUpload
                .deleteMany({ where: { url: dto.featuredImageUrl } })
                .catch(() => { });
        }
        return publication;
    }
    async findById(id, userId, userRole) {
        const publication = await this.prisma.publication.findUnique({
            where: { id },
            include: {
                category: true,
                author: { select: { id: true, username: true } },
            },
        });
        if (!publication)
            throw new common_1.NotFoundException('Publication not found');
        if (userRole !== client_1.Role.SUPER_ADMIN && publication.authorId !== userId)
            throw new common_1.ForbiddenException('You can only read your own publications');
        return publication;
    }
    async update(id, dto, userId, userRole) {
        const pub = await this.prisma.publication.findUnique({ where: { id } });
        if (!pub)
            throw new common_1.NotFoundException('Publication not found');
        if (userRole !== client_1.Role.SUPER_ADMIN && pub.authorId !== userId)
            throw new common_1.ForbiddenException('You can only modify your own publications');
        const data = { ...dto };
        if (dto.scheduledAt)
            data.scheduledAt = new Date(dto.scheduledAt);
        if (dto.status === 'PUBLISHED')
            data.publishedAt = new Date();
        if (typeof data.body === 'string')
            data.body = this.sanitizer.sanitize(data.body);
        if (typeof data.title === 'string' && data.title.trim()) {
            const cleanTitle = this.sanitizer.sanitize(data.title);
            data.title = cleanTitle;
            data.slug = await this.slugService.uniqueSlug(cleanTitle, id);
        }
        const currentTitle = typeof data.title === 'string' ? data.title : pub.title;
        const currentBody = typeof data.body === 'string' ? data.body : pub.body;
        data.searchText = (0, normalize_search_1.normalizeSearchText)(`${currentTitle} ${currentBody}`);
        return this.prisma.publication.update({ where: { id }, data });
    }
    async remove(id, userId, userRole) {
        const pub = await this.prisma.publication.findUnique({ where: { id } });
        if (!pub)
            throw new common_1.NotFoundException('Publication not found');
        if (userRole !== client_1.Role.SUPER_ADMIN && pub.authorId !== userId)
            throw new common_1.ForbiddenException('You can only modify your own publications');
        await this.prisma.publication.delete({ where: { id } });
    }
    async findAll(query, userId, userRole) {
        if (userRole === client_1.Role.SUPER_ADMIN)
            return this.findAllWhere(query, query.authorId);
        if (userRole === client_1.Role.EDITOR)
            return this.findAllWhere(query, userId);
        throw new common_1.ForbiddenException('Insufficient permissions');
    }
    async findAllWhere(query, authorId) {
        const page = query.page ?? 1;
        const pageSize = query.pageSize ?? 10;
        const where = {
            ...(query.status ? { status: query.status } : {}),
            ...(query.search
                ? { title: { contains: query.search, mode: 'insensitive' } }
                : {}),
            ...(authorId !== undefined
                ? { authorId }
                : query.authorId
                    ? { authorId: query.authorId }
                    : {}),
        };
        const [data, total] = await Promise.all([
            this.prisma.publication.findMany({
                where,
                include: {
                    category: true,
                    author: { select: { id: true, username: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            this.prisma.publication.count({ where }),
        ]);
        return { data, total, page, pageSize };
    }
    async stats(userRole) {
        if (userRole !== client_1.Role.SUPER_ADMIN)
            throw new common_1.ForbiddenException('Insufficient permissions');
        const [totalArticles, activeDrafts, viewsAgg] = await Promise.all([
            this.prisma.publication.count(),
            this.prisma.publication.count({ where: { status: 'DRAFT' } }),
            this.prisma.publication.aggregate({ _sum: { views: true } }),
        ]);
        return {
            totalArticles,
            activeDrafts,
            totalViews: viewsAgg._sum.views ?? 0,
            comments: 0,
        };
    }
};
exports.PublicationsAdminService = PublicationsAdminService;
exports.PublicationsAdminService = PublicationsAdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        slug_service_1.SlugService,
        html_sanitizer_service_1.HtmlSanitizerService])
], PublicationsAdminService);
//# sourceMappingURL=publications-admin.service.js.map