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
var UploadCleanupService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadCleanupService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const cloudinary_1 = require("cloudinary");
const prisma_service_1 = require("../../prisma/prisma.service");
let UploadCleanupService = UploadCleanupService_1 = class UploadCleanupService {
    prisma;
    logger = new common_1.Logger(UploadCleanupService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }
    async cleanupStaleUploads() {
        const cutoff = new Date(Date.now() - 30 * 60 * 1000);
        const stale = await this.prisma.pendingUpload.findMany({ where: { createdAt: { lt: cutoff } } });
        for (const upload of stale) {
            try {
                await cloudinary_1.v2.uploader.destroy(upload.publicId);
            }
            catch {
                this.logger.warn(`Failed to delete Cloudinary asset: ${upload.publicId}`);
            }
        }
        if (stale.length > 0) {
            await this.prisma.pendingUpload.deleteMany({
                where: { id: { in: stale.map((s) => s.id) } },
            });
            this.logger.log(`Cleaned up ${stale.length} stale pending upload(s)`);
        }
    }
};
exports.UploadCleanupService = UploadCleanupService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_5_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UploadCleanupService.prototype, "cleanupStaleUploads", null);
exports.UploadCleanupService = UploadCleanupService = UploadCleanupService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UploadCleanupService);
//# sourceMappingURL=upload-cleanup.service.js.map