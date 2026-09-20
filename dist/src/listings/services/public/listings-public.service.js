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
exports.ListingsPublicService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const normalize_search_1 = require("../../../common/normalize-search");
let ListingsPublicService = class ListingsPublicService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async submit(dto, userId) {
        const existing = await this.prisma.businessListing.findFirst({
            where: {
                businessName: dto.businessName,
                phone: dto.phone.trim(),
            },
        });
        if (existing) {
            throw new common_1.ConflictException('A listing with this business name and phone already exists');
        }
        return this.prisma.businessListing.create({
            data: {
                businessName: dto.businessName,
                category: dto.category,
                description: dto.description,
                phone: dto.phone.trim(),
                email: dto.email.trim().toLowerCase(),
                website: dto.website,
                status: 'PENDING',
                createdById: userId,
                searchText: (0, normalize_search_1.normalizeSearchText)(`${dto.businessName} ${dto.description ?? ''} ${dto.phone} ${dto.email}`),
            },
        });
    }
    findApproved(query) {
        return this.prisma.businessListing.findMany({
            where: {
                status: 'APPROVED',
                ...(query.category ? { category: query.category } : {}),
                ...(query.search
                    ? {
                        searchText: {
                            contains: query.search.toLowerCase(),
                            mode: 'insensitive',
                        },
                    }
                    : {}),
            },
            orderBy: { businessName: 'asc' },
        });
    }
};
exports.ListingsPublicService = ListingsPublicService;
exports.ListingsPublicService = ListingsPublicService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ListingsPublicService);
//# sourceMappingURL=listings-public.service.js.map