import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaService } from '../../prisma/prisma.service';

/** Cron job: deletes pending uploads from Cloudinary + DB if no publication was created within 30 minutes. */
@Injectable()
export class UploadCleanupService {
  private readonly logger = new Logger(UploadCleanupService.name);

  constructor(private prisma: PrismaService) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async cleanupStaleUploads() {
    const cutoff = new Date(Date.now() - 30 * 60 * 1000);
    const stale = await this.prisma.pendingUpload.findMany({ where: { createdAt: { lt: cutoff } } });

    for (const upload of stale) {
      try {
        await cloudinary.uploader.destroy(upload.publicId);
      } catch {
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
}
