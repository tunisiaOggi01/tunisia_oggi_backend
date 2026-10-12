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
      this.logger.warn(
        `Cloudinary not configured: CLOUDINARY_CLOUD_NAME=${!!cloud_name} CLOUDINARY_API_KEY=${!!api_key} CLOUDINARY_API_SECRET=${!!api_secret}`,
      );
    }
    cloudinary.config({ cloud_name, api_key, api_secret });
  }

  async uploadImage(
    file: Express.Multer.File,
    userId: string,
  ): Promise<string> {
    if (!file || !file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed');
    }
    if (!hasImageSignature(file.buffer)) {
      throw new BadRequestException(
        'File content does not match an image signature',
      );
    }

    const { secure_url, public_id } = await new Promise<{
      secure_url: string;
      public_id: string;
    }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'tunisia-oggi', resource_type: 'image' },
        (error: Error | null | undefined, result) => {
          if (error) {
            this.logger.error('Cloudinary upload error', error);
            return reject(error);
          }
          if (!result) return reject(new Error('Upload failed'));
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        },
      );
      stream.end(file.buffer);
    }).catch((error: unknown) => {
      // Cloudinary reports failures (e.g. missing credentials) as plain { message, http_code } objects.
      const message =
        error && typeof error === 'object' && 'message' in error
          ? String((error as { message: unknown }).message)
          : '';
      throw new BadRequestException(
        message
          ? `Upload rejected by storage provider: ${message}`
          : 'Upload rejected by storage provider',
      );
    });

    await this.prisma.pendingUpload.create({
      data: { url: secure_url, publicId: public_id, userId },
    });

    return secure_url;
  }
}

const IMAGE_SIGNATURES: ReadonlyArray<{ offset: number; bytes: number[] }> = [
  { offset: 0, bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] }, // PNG
  { offset: 0, bytes: [0xff, 0xd8, 0xff] }, // JPEG
  { offset: 0, bytes: [0x47, 0x49, 0x46, 0x38] }, // GIF
  { offset: 0, bytes: [0x42, 0x4d] }, // BMP
  { offset: 8, bytes: [0x57, 0x45, 0x42, 0x50] }, // WEBP (RIFF....WEBP)
];

/** Returns true when the buffer starts with a known image magic-byte signature. */
function hasImageSignature(buffer: Buffer): boolean {
  return IMAGE_SIGNATURES.some(({ offset, bytes }) =>
    bytes.every((byte, index) => buffer[offset + index] === byte),
  );
}
