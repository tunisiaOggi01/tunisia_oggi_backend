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
exports.RefreshTokenService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../../prisma/prisma.service");
let RefreshTokenService = class RefreshTokenService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    hash(token) {
        return (0, crypto_1.createHash)('sha256').update(token).digest('hex');
    }
    async create(userId) {
        const raw = (0, crypto_1.randomBytes)(48).toString('hex');
        const familyId = (0, crypto_1.randomUUID)();
        await this.prisma.refreshToken.create({
            data: {
                tokenHash: this.hash(raw),
                userId,
                familyId,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });
        return raw;
    }
    async rotate(raw) {
        const tokenHash = this.hash(raw);
        const existing = await this.prisma.refreshToken.findFirst({ where: { tokenHash, isRevoked: false } });
        if (!existing)
            throw new common_1.UnauthorizedException('Invalid refresh token');
        if (existing.expiresAt < new Date()) {
            await this.prisma.refreshToken.update({ where: { id: existing.id }, data: { isRevoked: true } });
            throw new common_1.UnauthorizedException('Refresh token expired');
        }
        await this.prisma.refreshToken.update({ where: { id: existing.id }, data: { isRevoked: true } });
        const anyInFamily = await this.prisma.refreshToken.findFirst({
            where: { familyId: existing.familyId, isRevoked: true, id: { not: existing.id } },
        });
        const familyId = anyInFamily ? (0, crypto_1.randomUUID)() : existing.familyId;
        const newRaw = (0, crypto_1.randomBytes)(48).toString('hex');
        await this.prisma.refreshToken.create({
            data: {
                tokenHash: this.hash(newRaw),
                userId: existing.userId,
                familyId,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });
        const user = await this.prisma.user.findUnique({ where: { id: existing.userId } });
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        const csrf = (0, crypto_1.randomBytes)(32).toString('hex');
        const accessToken = this.jwtService.sign({
            sub: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
            csrf,
        });
        return { accessToken, csrfToken: csrf, newRefreshToken: newRaw };
    }
    async revokeAll(userId) {
        await this.prisma.refreshToken.updateMany({
            where: { userId, isRevoked: false },
            data: { isRevoked: true },
        });
    }
    async revoke(raw) {
        const tokenHash = this.hash(raw);
        await this.prisma.refreshToken.updateMany({
            where: { tokenHash, isRevoked: false },
            data: { isRevoked: true },
        });
    }
};
exports.RefreshTokenService = RefreshTokenService;
exports.RefreshTokenService = RefreshTokenService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, jwt_1.JwtService])
], RefreshTokenService);
//# sourceMappingURL=refresh-token.service.js.map