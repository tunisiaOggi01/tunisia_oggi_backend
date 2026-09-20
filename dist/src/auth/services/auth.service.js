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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = require("crypto");
const prisma_service_1 = require("../../prisma/prisma.service");
const refresh_token_service_1 = require("./refresh-token.service");
const otp_service_1 = require("./otp.service");
let AuthService = class AuthService {
    prisma;
    jwtService;
    refreshTokenService;
    otpService;
    constructor(prisma, jwtService, refreshTokenService, otpService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
        this.otpService = otpService;
    }
    mapUser(user) {
        return {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
            imageUrl: user.imageUrl,
            description: user.description,
            profileCompleted: user.profileCompleted,
            heardAbout: user.heardAbout,
        };
    }
    async validateAndLogin(email, password) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user?.passwordHash)
            throw new common_1.UnauthorizedException('Invalid credentials');
        if (!(await bcrypt_1.default.compare(password, user.passwordHash)))
            throw new common_1.UnauthorizedException('Invalid credentials');
        const tokens = await this.issueTokens(user.id, user);
        return { ...tokens, user: this.mapUser(user) };
    }
    async register(email, username, password) {
        const existing = await this.prisma.user.findFirst({
            where: { OR: [{ email }, { username }] },
        });
        if (existing)
            throw new common_1.ConflictException('Email or username already in use');
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        const user = await this.prisma.user.create({
            data: { email, username, passwordHash, role: 'VISITOR' },
        });
        return { user: this.mapUser(user) };
    }
    async updateProfile(userId, data) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: { ...data, profileCompleted: true },
        });
        return this.mapUser(user);
    }
    async updateHeardAbout(userId, source) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: { heardAbout: source },
        });
        return this.mapUser(user);
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        return this.mapUser(user);
    }
    async forgotPassword(email) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            return { message: 'If the email exists, a reset code has been sent.' };
        await this.otpService.generate(email);
        return { message: 'Reset code sent to your email.' };
    }
    async resetPassword(email, otpCode, newPassword) {
        await this.otpService.verify(email, otpCode);
        const passwordHash = await bcrypt_1.default.hash(newPassword, 10);
        const user = await this.prisma.user.update({
            where: { email },
            data: { passwordHash },
        });
        await this.refreshTokenService.revokeAll(user.id);
    }
    async handleGoogleLogin(profile) {
        const existing = await this.prisma.user.findFirst({
            where: { OR: [{ googleId: profile.googleId }, { email: profile.email }] },
        });
        if (existing) {
            if (!existing.googleId)
                await this.prisma.user.update({
                    where: { id: existing.id },
                    data: { googleId: profile.googleId },
                });
            return existing;
        }
        return this.prisma.user.create({
            data: {
                email: profile.email,
                username: profile.username,
                googleId: profile.googleId,
                imageUrl: profile.imageUrl,
                role: 'VISITOR',
            },
        });
    }
    async issueTokens(userId, user) {
        const csrf = (0, crypto_1.randomBytes)(32).toString('hex');
        const token = this.jwtService.sign({
            sub: userId,
            email: user.email,
            username: user.username,
            role: user.role,
            csrf,
        });
        const refreshToken = await this.refreshTokenService.create(userId);
        return { token, csrfToken: csrf, refreshToken };
    }
    async changeUsername(userId, username) {
        const existing = await this.prisma.user.findFirst({
            where: { username, NOT: { id: userId } },
        });
        if (existing)
            throw new common_1.ConflictException('Username already taken');
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: { username },
        });
        return this.mapUser(user);
    }
    async changeEmail(userId, email) {
        const existing = await this.prisma.user.findFirst({
            where: { email, NOT: { id: userId } },
        });
        if (existing)
            throw new common_1.ConflictException('Email already in use');
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: { email },
        });
        return this.mapUser(user);
    }
    async changePassword(userId, currentPassword, newPassword) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user?.passwordHash)
            throw new common_1.UnauthorizedException('User not found');
        if (!(await bcrypt_1.default.compare(currentPassword, user.passwordHash)))
            throw new common_1.UnauthorizedException('Current password is incorrect');
        const passwordHash = await bcrypt_1.default.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { passwordHash },
        });
        await this.refreshTokenService.revokeAll(userId);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        refresh_token_service_1.RefreshTokenService,
        otp_service_1.OtpService])
], AuthService);
//# sourceMappingURL=auth.service.js.map