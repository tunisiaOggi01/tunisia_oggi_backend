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
exports.NewsletterAdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let NewsletterAdminService = class NewsletterAdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const pageSize = query.pageSize ?? 10;
        const where = { deletedAt: null };
        const [data, total] = await Promise.all([
            this.prisma.newsletterSubscriber.findMany({
                where,
                orderBy: { subscribedAt: 'desc' },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            this.prisma.newsletterSubscriber.count({ where }),
        ]);
        return { data, total, page, pageSize };
    }
    async stats() {
        const weekAgo = new Date(Date.now() - 7 * 86400000);
        const [active, newThisWeek, softDeleted] = await Promise.all([
            this.prisma.newsletterSubscriber.count({ where: { deletedAt: null } }),
            this.prisma.newsletterSubscriber.count({
                where: { deletedAt: null, subscribedAt: { gte: weekAgo } },
            }),
            this.prisma.newsletterSubscriber.count({
                where: { NOT: { deletedAt: null } },
            }),
        ]);
        return { active, newThisWeek, softDeleted };
    }
    async softDelete(id) {
        await this.ensureExists(id);
        await this.prisma.newsletterSubscriber.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
    async exportCsv() {
        const subscribers = await this.prisma.newsletterSubscriber.findMany({
            where: { deletedAt: null },
            orderBy: { subscribedAt: 'desc' },
            select: { email: true, subscribedAt: true },
        });
        const rows = subscribers
            .map((s) => `${s.email},${s.subscribedAt.toISOString()}`)
            .join('\n');
        return `\uFEFFemail,subscribedAt\n${rows}`;
    }
    async ensureExists(id) {
        const found = await this.prisma.newsletterSubscriber.findUnique({
            where: { id },
        });
        if (!found)
            throw new common_1.NotFoundException('Subscriber not found');
    }
};
exports.NewsletterAdminService = NewsletterAdminService;
exports.NewsletterAdminService = NewsletterAdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NewsletterAdminService);
//# sourceMappingURL=newsletter-admin.service.js.map