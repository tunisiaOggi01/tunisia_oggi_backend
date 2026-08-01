import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaService } from '../../prisma/prisma.service';

/** Uploads image files to Cloudinary, tracks them as pending for cleanup if the post is never created. */
@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  constructor(private prisma: PrismaService) {
    const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
    const api_key = process.env.CLOUDINARY_API_KEY;
    const api_secret = process.env.CLOUDINARY_API_SECRET;
    if (!cloud_name || !api_key || !api_secret) {
      this.logger.warn(`Cloudinary not configured: CLOUDINARY_CLOUD_NAME=${!!cloud_name} CLOUDINARY_API_KEY=${!!api_key} CLOUDINARY_API_SECRET=${!!api_secret}`);
    }
    cloudinary.config({ cloud_name, api_key, api_secret });
  }

  async uploadImage(file: Express.Multer.File, userId: string): Promise<string> {
    if (!file || !file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed');
    }

    const { secure_url, public_id } = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder: 'tunisia-oggi' }, (error, result) => {
        if (error) {
          this.logger.error('Cloudinary upload error', error);
          return reject(error);
        }
        if (!result) return reject(new Error('Upload failed'));
        resolve({ secure_url: result.secure_url, public_id: result.public_id });
      });
      stream.end(file.buffer);
    });

    await this.prisma.pendingUpload.create({
      data: { url: secure_url, publicId: public_id, userId },
    });

    return secure_url;
  }
}
