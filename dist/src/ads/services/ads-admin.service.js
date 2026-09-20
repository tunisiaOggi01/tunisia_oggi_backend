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
exports.AdsAdminService = void 0;
exports.deriveStatus = deriveStatus;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let AdsAdminService = class AdsAdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto, admin) {
        const startDate = new Date(dto.startDate);
        const endDate = new Date(dto.endDate);
        if (endDate <= startDate) {
            throw new common_1.BadRequestException('endDate must be after startDate');
        }
        const ad = await this.prisma.advertisement.create({
            data: {
                title: dto.title,
                imageUrl: dto.imageUrl,
                linkUrl: dto.linkUrl,
                placement: dto.placement,
                advertiserName: dto.advertiserName,
                advertiserEmail: dto.advertiserEmail,
                maxImpressions: dto.maxImpressions,
                startDate,
                endDate,
            },
        });
        await this.log(admin, 'CREATE', ad.title, ad.id);
        return ad;
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const pageSize = query.pageSize ?? 10;
        const where = query.placement ? { placement: query.placement } : {};
        const [data, total] = await Promise.all([
            this.prisma.advertisement.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            this.prisma.advertisement.count({ where }),
        ]);
        return {
            data: data.map((ad) => ({
                ...ad,
                status: deriveStatus(ad.startDate, ad.endDate),
                budgetExhausted: ad.maxImpressions !== null && ad.impressions >= ad.maxImpressions,
                remainingImpressions: ad.maxImpressions === null
                    ? null
                    : Math.max(0, ad.maxImpressions - ad.impressions),
            })),
            total,
            page,
            pageSize,
        };
    }
    async stats() {
        const now = new Date();
        const [scheduled, active, expired, agg] = await Promise.all([
            this.prisma.advertisement.count({ where: { startDate: { gt: now } } }),
            this.prisma.advertisement.count({
                where: { startDate: { lte: now }, endDate: { gte: now } },
            }),
            this.prisma.advertisement.count({ where: { endDate: { lt: now } } }),
            this.prisma.advertisement.aggregate({
                _sum: { impressions: true, clicks: true },
            }),
        ]);
        return {
            scheduled,
            active,
            expired,
            totalImpressions: agg._sum.impressions ?? 0,
            totalClicks: agg._sum.clicks ?? 0,
        };
    }
    async remove(id, admin) {
        const ad = await this.ensureExists(id);
        await this.log(admin, 'DELETE', ad.title, ad.id);
        await this.prisma.advertisement.delete({ where: { id } });
    }
    async update(id, dto, admin) {
        const ad = await this.ensureExists(id);
        const status = deriveStatus(ad.startDate, ad.endDate);
        if (status === 'SCADUTA') {
            throw new common_1.BadRequestException('Cannot modify an expired ad');
        }
        if (status === 'ATTIVA' && dto.startDate) {
            throw new common_1.BadRequestException('Cannot change start date of a running ad');
        }
        const changes = {};
        if (dto.title !== undefined && dto.title !== ad.title)
            changes.title = { from: ad.title, to: dto.title };
        if (dto.imageUrl !== undefined && dto.imageUrl !== ad.imageUrl)
            changes.imageUrl = { from: ad.imageUrl, to: dto.imageUrl };
        if (dto.linkUrl !== undefined && dto.linkUrl !== ad.linkUrl)
            changes.linkUrl = { from: ad.linkUrl, to: dto.linkUrl };
        if (dto.placement !== undefined && dto.placement !== ad.placement)
            changes.placement = { from: ad.placement, to: dto.placement };
        if (dto.advertiserName !== ad.advertiserName)
            changes.advertiserName = {
                from: ad.advertiserName,
                to: dto.advertiserName ?? null,
            };
        if (dto.advertiserEmail !== ad.advertiserEmail)
            changes.advertiserEmail = {
                from: ad.advertiserEmail,
                to: dto.advertiserEmail ?? null,
            };
        if (dto.maxImpressions !== undefined &&
            dto.maxImpressions !== ad.maxImpressions)
            changes.maxImpressions = {
                from: ad.maxImpressions,
                to: dto.maxImpressions,
            };
        if (dto.startDate)
            changes.startDate = {
                from: ad.startDate.toISOString(),
                to: new Date(dto.startDate).toISOString(),
            };
        if (dto.endDate)
            changes.endDate = {
                from: ad.endDate.toISOString(),
                to: new Date(dto.endDate).toISOString(),
            };
        const data = {};
        if (dto.title !== undefined)
            data.title = dto.title;
        if (dto.imageUrl !== undefined)
            data.imageUrl = dto.imageUrl;
        if (dto.linkUrl !== undefined)
            data.linkUrl = dto.linkUrl;
        if (dto.placement !== undefined)
            data.placement = dto.placement;
        if (dto.advertiserName !== undefined)
            data.advertiserName = dto.advertiserName;
        if (dto.advertiserEmail !== undefined)
            data.advertiserEmail = dto.advertiserEmail;
        if (dto.maxImpressions !== undefined)
            data.maxImpressions = dto.maxImpressions;
        if (dto.startDate !== undefined)
            data.startDate = new Date(dto.startDate);
        if (dto.endDate !== undefined)
            data.endDate = new Date(dto.endDate);
        if (data.startDate &&
            data.endDate &&
            data.endDate <= data.startDate) {
            throw new common_1.BadRequestException('endDate must be after startDate');
        }
        if (Object.keys(changes).length > 0) {
            await this.log(admin, 'UPDATE', ad.title, ad.id, changes);
        }
        return this.prisma.advertisement.update({ where: { id }, data });
    }
    async log(admin, action, adTitle, advertisementId, changes) {
        return this.prisma.adLog.create({
            data: {
                adminName: admin.username,
                adminEmail: admin.email,
                action,
                adTitle,
                advertisementId,
                changes: (changes ?? undefined),
            },
        });
    }
    async findLogs(query) {
        const page = query.page ?? 1;
        const pageSize = query.pageSize ?? 20;
        const [data, total] = await Promise.all([
            this.prisma.adLog.findMany({
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            this.prisma.adLog.count(),
        ]);
        return { data, total, page, pageSize };
    }
    async ensureExists(id) {
        const found = await this.prisma.advertisement.findUnique({ where: { id } });
        if (!found)
            throw new common_1.NotFoundException('Ad not found');
        return found;
    }
};
exports.AdsAdminService = AdsAdminService;
exports.AdsAdminService = AdsAdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdsAdminService);
function deriveStatus(startDate, endDate) {
    const now = new Date();
    if (endDate < now)
        return 'SCADUTA';
    if (startDate > now)
        return 'PROGRAMMATA';
    return 'ATTIVA';
}
//# sourceMappingURL=ads-admin.service.js.map