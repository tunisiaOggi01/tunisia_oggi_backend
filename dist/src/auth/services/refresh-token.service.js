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
const rotation_grace_1 = require("./rotation-grace");
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
    tokenRow(raw, userId, familyId) {
        return {
            tokenHash: this.hash(raw),
            userId,
            familyId,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        };
    }
    async create(userId) {
        const raw = (0, crypto_1.randomBytes)(48).toString('hex');
        await this.prisma.refreshToken.create({
            data: this.tokenRow(raw, userId, (0, crypto_1.randomUUID)()),
        });
        return raw;
    }
    async rotate(raw) {
        const presented = await this.prisma.refreshToken.findFirst({
            where: { tokenHash: this.hash(raw) },
        });
        if (!presented)
            throw new common_1.UnauthorizedException('Invalid refresh token');
        if (presented.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('Refresh token expired');
        }
        const sibling = presented.isRevoked
            ? await this.prisma.refreshToken.findFirst({
                where: { familyId: presented.familyId, isRevoked: false },
            })
            : null;
        if (presented.isRevoked && (!sibling || !(0, rotation_grace_1.isConcurrentRotation)(sibling))) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        if (!presented.isRevoked) {
            await this.prisma.refreshToken.update({
                where: { id: presented.id },
                data: { isRevoked: true },
            });
        }
        const familyId = presented.isRevoked ? (0, crypto_1.randomUUID)() : presented.familyId;
        const newRaw = (0, crypto_1.randomBytes)(48).toString('hex');
        await this.prisma.refreshToken.create({
            data: this.tokenRow(newRaw, presented.userId, familyId),
        });
        const user = await this.prisma.user.findUnique({
            where: { id: presented.userId },
        });
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
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], RefreshTokenService);
//# sourceMappingURL=refresh-token.service.js.map