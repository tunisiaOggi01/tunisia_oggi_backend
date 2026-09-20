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
exports.SearchPublicService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const normalize_search_1 = require("../../common/normalize-search");
const AUTHOR_SELECT = { select: { id: true, username: true, imageUrl: true } };
let SearchPublicService = class SearchPublicService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async search(query) {
        const page = query.page ?? 1;
        const pageSize = query.pageSize ?? 9;
        const q = (0, normalize_search_1.normalizeSearchText)(query.q);
        const textMatch = q
            ? { searchText: { contains: q, mode: 'insensitive' } }
            : {};
        const publishedWhere = { status: 'PUBLISHED', ...textMatch };
        const [articles, totalArticles, listings, categoryGroup] = await Promise.all([
            this.prisma.publication.findMany({
                where: publishedWhere,
                include: { category: true, author: AUTHOR_SELECT },
                orderBy: { publishedAt: 'desc' },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            this.prisma.publication.count({ where: publishedWhere }),
            this.prisma.businessListing.findMany({
                where: { status: 'APPROVED', ...textMatch },
                take: 5,
            }),
            this.prisma.publication.groupBy({
                by: ['categoryId'],
                where: publishedWhere,
                _count: { _all: true },
            }),
        ]);
        const categories = await this.prisma.category.findMany({
            where: { id: { in: categoryGroup.map((g) => g.categoryId) } },
            select: { id: true, name: true, slug: true },
        });
        const byId = new Map(categories.map((c) => [c.id, c]));
        const categoryCounts = categoryGroup
            .map((g) => ({ ...byId.get(g.categoryId), count: g._count._all }))
            .filter((c) => c.name)
            .sort((a, b) => b.count - a.count);
        return {
            data: {
                articles,
                totalArticles,
                page,
                pageSize,
                listings,
                categoryCounts,
            },
        };
    }
};
exports.SearchPublicService = SearchPublicService;
exports.SearchPublicService = SearchPublicService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SearchPublicService);
//# sourceMappingURL=search-public.service.js.map