import { BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { UploadService } from './services/upload.service';

jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload_stream: jest.fn(
        (
          _options: Record<string, unknown>,
          callback: (error: null, result: Record<string, string>) => void,
        ) => ({
          end: () => {
            callback(null, {
              secure_url:
                'https://res.cloudinary.com/demo/image/upload/v1/test.jpg',
              public_id: 'test',
            });
          },
        }),
      ),
    },
  },
}));

const mockPrisma = {
  pendingUpload: { create: jest.fn().mockResolvedValue({}) },
} as unknown as ConstructorParameters<typeof UploadService>[0];

const PNG_BUFFER = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
]);

describe('UploadService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('resolves with the Cloudinary secure_url for a real image buffer', async () => {
    const service = new UploadService(mockPrisma);
    const url = await service.uploadImage(
      { buffer: PNG_BUFFER, mimetype: 'image/png' } as any,
      'user-id',
    );
    expect(url).toBe(
      'https://res.cloudinary.com/demo/image/upload/v1/test.jpg',
    );
  });

  it('rejects an HTML payload forged as image/png before reaching Cloudinary', async () => {
    const service = new UploadService(mockPrisma);
    await expect(
      service.uploadImage(
        {
          buffer: Buffer.from('<html><script>alert(1)</script></html>'),
          mimetype: 'image/png',
        } as any,
        'user-id',
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(
      (cloudinary.uploader.upload_stream as jest.Mock).mock.calls.length,
    ).toBe(0);
  });

  it('rejects a non-image mimetype', async () => {
    const service = new UploadService(mockPrisma);
    await expect(
      service.uploadImage(
        { buffer: PNG_BUFFER, mimetype: 'text/html' } as any,
        'user-id',
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
