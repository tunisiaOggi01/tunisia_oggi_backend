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
exports.ListingsAdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
let ListingsAdminService = class ListingsAdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const pageSize = query.pageSize ?? 10;
        const where = {
            ...(query.status ? { status: query.status } : {}),
            ...(query.category ? { category: query.category } : {}),
            ...(query.search
                ? {
                    searchText: {
                        contains: query.search.toLowerCase(),
                        mode: 'insensitive',
                    },
                }
                : {}),
        };
        const [data, total] = await Promise.all([
            this.prisma.businessListing.findMany({
                where,
                orderBy: { submittedAt: 'desc' },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            this.prisma.businessListing.count({ where }),
        ]);
        return { data, total, page, pageSize };
    }
    async updateStatus(id, dto) {
        await this.ensureExists(id);
        return this.prisma.businessListing.update({
            where: { id },
            data: { status: dto.status, reviewedAt: new Date() },
        });
    }
    async remove(id) {
        await this.ensureExists(id);
        await this.prisma.businessListing.delete({ where: { id } });
    }
    async stats() {
        const [pending, approved, rejected, agg] = await Promise.all([
            this.prisma.businessListing.count({ where: { status: 'PENDING' } }),
            this.prisma.businessListing.count({ where: { status: 'APPROVED' } }),
            this.prisma.businessListing.count({ where: { status: 'REJECTED' } }),
            this.prisma.businessListing.aggregate({
                _sum: {
                    views: true,
                    phoneClicks: true,
                    emailClicks: true,
                    websiteClicks: true,
                },
            }),
        ]);
        return {
            pending,
            approved,
            rejected,
            totalViews: agg._sum.views ?? 0,
            totalClicks: (agg._sum.phoneClicks ?? 0) +
                (agg._sum.emailClicks ?? 0) +
                (agg._sum.websiteClicks ?? 0),
        };
    }
    async ensureExists(id) {
        const found = await this.prisma.businessListing.findUnique({
            where: { id },
        });
        if (!found)
            throw new common_1.NotFoundException('Listing not found');
    }
};
exports.ListingsAdminService = ListingsAdminService;
exports.ListingsAdminService = ListingsAdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ListingsAdminService);
//# sourceMappingURL=listings-admin.service.js.map