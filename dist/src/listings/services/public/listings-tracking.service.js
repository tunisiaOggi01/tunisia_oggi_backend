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
exports.ListingsTrackingService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../../prisma/prisma.service");
const CLICK_COUNTERS = {
    PHONE: 'phoneClicks',
    EMAIL: 'emailClicks',
    WEBSITE: 'websiteClicks',
};
let ListingsTrackingService = class ListingsTrackingService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id, ip) {
        const listing = await this.prisma.businessListing.findFirst({
            where: { id, status: 'APPROVED' },
        });
        if (!listing)
            throw new common_1.NotFoundException('Listing not found');
        try {
            await this.prisma.listingView.create({
                data: { ip, listingId: id },
            });
        }
        catch (error) {
            if (error instanceof client_1.Prisma.PrismaClientKnownRequestError &&
                error.code === 'P2002') {
                return listing;
            }
            throw error;
        }
        return this.prisma.businessListing.update({
            where: { id },
            data: { views: { increment: 1 } },
        });
    }
    async trackClick(id, action) {
        const listing = await this.prisma.businessListing.findFirst({
            where: { id, status: 'APPROVED' },
        });
        if (!listing)
            throw new common_1.NotFoundException('Listing not found');
        return this.prisma.businessListing.update({
            where: { id },
            data: { [CLICK_COUNTERS[action]]: { increment: 1 } },
        });
    }
    getMine(userId) {
        return this.prisma.businessListing.findMany({
            where: { createdById: userId },
            orderBy: { submittedAt: 'desc' },
        });
    }
    async getMineStats(id, userId) {
        const listing = await this.prisma.businessListing.findUnique({
            where: { id },
        });
        if (!listing)
            throw new common_1.NotFoundException('Listing not found');
        if (listing.createdById !== userId) {
            throw new common_1.ForbiddenException('Not your listing');
        }
        return {
            views: listing.views,
            phoneClicks: listing.phoneClicks,
            emailClicks: listing.emailClicks,
            websiteClicks: listing.websiteClicks,
        };
    }
};
exports.ListingsTrackingService = ListingsTrackingService;
exports.ListingsTrackingService = ListingsTrackingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ListingsTrackingService);
//# sourceMappingURL=listings-tracking.service.js.map