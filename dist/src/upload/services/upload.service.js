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
var UploadService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const cloudinary_1 = require("cloudinary");
const prisma_service_1 = require("../../prisma/prisma.service");
let UploadService = UploadService_1 = class UploadService {
    prisma;
    logger = new common_1.Logger(UploadService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
        const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
        const api_key = process.env.CLOUDINARY_API_KEY;
        const api_secret = process.env.CLOUDINARY_API_SECRET;
        if (!cloud_name || !api_key || !api_secret) {
            this.logger.warn(`Cloudinary not configured: CLOUDINARY_CLOUD_NAME=${!!cloud_name} CLOUDINARY_API_KEY=${!!api_key} CLOUDINARY_API_SECRET=${!!api_secret}`);
        }
        cloudinary_1.v2.config({ cloud_name, api_key, api_secret });
    }
    async uploadImage(file, userId) {
        if (!file || !file.mimetype.startsWith('image/')) {
            throw new common_1.BadRequestException('Only image files are allowed');
        }
        const { secure_url, public_id } = await new Promise((resolve, reject) => {
            const stream = cloudinary_1.v2.uploader.upload_stream({ folder: 'tunisia-oggi' }, (error, result) => {
                if (error) {
                    this.logger.error('Cloudinary upload error', error);
                    return reject(error);
                }
                if (!result)
                    return reject(new Error('Upload failed'));
                resolve({ secure_url: result.secure_url, public_id: result.public_id });
            });
            stream.end(file.buffer);
        });
        await this.prisma.pendingUpload.create({
            data: { url: secure_url, publicId: public_id, userId },
        });
        return secure_url;
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = UploadService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UploadService);
//# sourceMappingURL=upload.service.js.map