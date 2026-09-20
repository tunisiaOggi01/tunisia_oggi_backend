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
exports.AdsPublicService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const rotation_1 = require("./rotation");
let AdsPublicService = class AdsPublicService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findActive(query) {
        const now = new Date();
        const active = await this.prisma.advertisement.findMany({
            where: {
                placement: query.placement,
                startDate: { lte: now },
                endDate: { gte: now },
            },
        });
        const picked = (0, rotation_1.pickWeighted)(active, query.limit ?? 1);
        return picked.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
    }
    async trackImpression(id, ip) {
        const ad = await this.findActiveById(id);
        try {
            await this.prisma.adImpression.create({
                data: { ip, advertisementId: ad.id },
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002') {
                return ad;
            }
            throw error;
        }
        return this.prisma.advertisement.update({
            where: { id: ad.id },
            data: { impressions: { increment: 1 } },
        });
    }
    async trackClick(id, ip) {
        const ad = await this.findActiveById(id);
        try {
            await this.prisma.adClick.create({
                data: { ip, advertisementId: ad.id },
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002') {
                return ad;
            }
            throw error;
        }
        return this.prisma.advertisement.update({
            where: { id: ad.id },
            data: { clicks: { increment: 1 } },
        });
    }
    async findActiveById(id) {
        const now = new Date();
        const ad = await this.prisma.advertisement.findFirst({
            where: { id, startDate: { lte: now }, endDate: { gte: now } },
        });
        if (!ad)
            throw new common_1.NotFoundException('Ad not found or not active');
        return ad;
    }
};
exports.AdsPublicService = AdsPublicService;
exports.AdsPublicService = AdsPublicService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdsPublicService);
//# sourceMappingURL=ads-public.service.js.map