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
exports.PublicationsReaderService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const PUBLIC_INCLUDE = { category: true, author: { select: { id: true, username: true, imageUrl: true } } };
let PublicationsReaderService = class PublicationsReaderService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findPublished(query) {
        const page = query.page ?? 1;
        const pageSize = query.pageSize ?? 10;
        const where = {
            status: 'PUBLISHED',
            ...(query.categorySlug ? { category: { slug: query.categorySlug } } : {}),
            ...(query.search ? { title: { contains: query.search, mode: 'insensitive' } } : {}),
        };
        const [data, total] = await Promise.all([
            this.prisma.publication.findMany({
                where, include: PUBLIC_INCLUDE, orderBy: { publishedAt: 'desc' },
                skip: (page - 1) * pageSize, take: pageSize,
            }),
            this.prisma.publication.count({ where }),
        ]);
        return { data, total, page, pageSize };
    }
    async findBySlug(slug, userId) {
        const publication = await this.prisma.publication.findFirst({
            where: { slug, status: 'PUBLISHED' },
            include: { ...PUBLIC_INCLUDE, reactions: true },
        });
        if (!publication)
            throw new common_1.NotFoundException('Publication not found');
        const { reactions, ...rest } = publication;
        return {
            ...rest,
            reactionCount: reactions.length,
            userReaction: userId ? reactions.find((r) => r.userId === userId)?.type ?? null : null,
        };
    }
    async findTrending(limit = 5) {
        return this.prisma.publication.findMany({
            where: { status: 'PUBLISHED' }, include: PUBLIC_INCLUDE, orderBy: { rankScore: 'desc' }, take: limit,
        });
    }
    async findRelated(slug) {
        const publication = await this.prisma.publication.findFirst({ where: { slug } });
        if (!publication)
            throw new common_1.NotFoundException('Publication not found');
        return this.prisma.publication.findMany({
            where: { status: 'PUBLISHED', categoryId: publication.categoryId, id: { not: publication.id } },
            include: { category: true }, orderBy: { publishedAt: 'desc' }, take: 3,
        });
    }
};
exports.PublicationsReaderService = PublicationsReaderService;
exports.PublicationsReaderService = PublicationsReaderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PublicationsReaderService);
//# sourceMappingURL=publications-reader.service.js.map