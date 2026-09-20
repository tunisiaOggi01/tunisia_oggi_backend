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
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const COMMENT_INCLUDE = {
    user: { select: { id: true, username: true, imageUrl: true } },
};
let CommentsService = class CommentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByPublication(publicationId) {
        const comments = await this.prisma.comment.findMany({
            where: { publicationId, parentId: null },
            include: {
                ...COMMENT_INCLUDE,
                replies: { include: COMMENT_INCLUDE, orderBy: { createdAt: 'asc' } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return comments;
    }
    async create(body, publicationId, userId, parentId) {
        const pub = await this.prisma.publication.findUnique({
            where: { id: publicationId },
        });
        if (!pub)
            throw new common_1.NotFoundException('Publication not found');
        if (parentId) {
            const parent = await this.prisma.comment.findUnique({
                where: { id: parentId },
            });
            if (!parent || parent.publicationId !== publicationId)
                throw new common_1.NotFoundException('Parent comment not found');
        }
        return this.prisma.comment.create({
            data: { body, userId, publicationId, parentId: parentId ?? null },
            include: COMMENT_INCLUDE,
        });
    }
    async update(id, dto, userId, role) {
        const comment = await this.prisma.comment.findUnique({ where: { id } });
        if (!comment)
            throw new common_1.NotFoundException('Comment not found');
        if (role !== client_1.Role.SUPER_ADMIN && comment.userId !== userId)
            throw new common_1.ForbiddenException('Cannot edit others comments');
        return this.prisma.comment.update({
            where: { id },
            data: { body: dto.body },
            include: COMMENT_INCLUDE,
        });
    }
    async remove(id, userId, role) {
        const comment = await this.prisma.comment.findUnique({ where: { id } });
        if (!comment)
            throw new common_1.NotFoundException('Comment not found');
        if (role !== client_1.Role.SUPER_ADMIN && comment.userId !== userId)
            throw new common_1.ForbiddenException('Cannot delete others comments');
        await this.prisma.comment.deleteMany({
            where: { OR: [{ id }, { parentId: id }] },
        });
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CommentsService);
//# sourceMappingURL=comments.service.js.map