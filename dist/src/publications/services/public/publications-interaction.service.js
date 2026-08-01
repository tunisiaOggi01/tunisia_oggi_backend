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
exports.PublicationsInteractionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
let PublicationsInteractionService = class PublicationsInteractionService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async view(id, userId) {
        const pub = await this.prisma.publication.findUnique({ where: { id } });
        if (!pub)
            throw new common_1.NotFoundException('Publication not found');
        const existing = await this.prisma.publicationView.findUnique({
            where: { userId_publicationId: { userId, publicationId: id } },
        });
        if (existing)
            return { viewed: false };
        await this.prisma.publicationView.create({ data: { userId, publicationId: id } });
        const ageInHours = (Date.now() - new Date(pub.publishedAt ?? pub.createdAt).getTime()) / 3_600_000;
        const views = pub.views + 1;
        const rankScore = views / Math.pow(Math.max(ageInHours, 0) + 2, 1.5);
        await this.prisma.publication.update({ where: { id }, data: { views, rankScore } });
        return { viewed: true, views, rankScore };
    }
    async react(id, userId, type) {
        const pub = await this.prisma.publication.findUnique({ where: { id } });
        if (!pub)
            throw new common_1.NotFoundException('Publication not found');
        const existing = await this.prisma.publicationReaction.findUnique({
            where: { userId_publicationId: { userId, publicationId: id } },
        });
        if (existing) {
            if (existing.type === type)
                return { reacted: false, type: existing.type };
            await this.prisma.publicationReaction.update({ where: { id: existing.id }, data: { type } });
        }
        else {
            await this.prisma.publicationReaction.create({ data: { userId, publicationId: id, type } });
            await this.prisma.publication.update({ where: { id }, data: { likes: { increment: 1 } } });
        }
        const count = await this.prisma.publicationReaction.count({ where: { publicationId: id } });
        return { reacted: true, type, reactionCount: count };
    }
    async unreact(id, userId) {
        const existing = await this.prisma.publicationReaction.findUnique({
            where: { userId_publicationId: { userId, publicationId: id } },
        });
        if (!existing)
            return { unreacted: false };
        await this.prisma.publicationReaction.delete({ where: { id: existing.id } });
        await this.prisma.publication.update({ where: { id }, data: { likes: { decrement: 1 } } });
        const count = await this.prisma.publicationReaction.count({ where: { publicationId: id } });
        return { unreacted: true, reactionCount: count };
    }
};
exports.PublicationsInteractionService = PublicationsInteractionService;
exports.PublicationsInteractionService = PublicationsInteractionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PublicationsInteractionService);
//# sourceMappingURL=publications-interaction.service.js.map