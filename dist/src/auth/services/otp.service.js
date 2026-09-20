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
exports.OtpService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../../prisma/prisma.service");
let OtpService = class OtpService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generate(email) {
        const code = String((0, crypto_1.randomInt)(100000, 999999));
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
        await this.prisma.otpCode.create({
            data: { email, code, type: 'PASSWORD_RESET', expiresAt },
        });
        return code;
    }
    async verify(email, code) {
        const otp = await this.prisma.otpCode.findFirst({
            where: {
                email,
                code,
                type: 'PASSWORD_RESET',
                isUsed: false,
                expiresAt: { gte: new Date() },
            },
            orderBy: { createdAt: 'desc' },
        });
        if (!otp)
            throw new common_1.BadRequestException('Invalid or expired OTP code');
        await this.prisma.otpCode.update({
            where: { id: otp.id },
            data: { isUsed: true },
        });
    }
};
exports.OtpService = OtpService;
exports.OtpService = OtpService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OtpService);
//# sourceMappingURL=otp.service.js.map