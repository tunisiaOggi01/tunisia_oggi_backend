import { UploadService } from './upload.service';

jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload_stream: jest.fn((_options, callback) => ({
        end: (_buffer: Buffer) => {
          callback(null, { secure_url: 'https://res.cloudinary.com/demo/image/upload/v1/test.jpg' });
        },
      })),
    },
  },
}));

describe('UploadService', () => {
  it('resolves with the Cloudinary secure_url for a valid image buffer', async () => {
    const service = new UploadService();
    const url = await service.uploadImage({ buffer: Buffer.from('fake-image-bytes'), mimetype: 'image/png' } as any);
    expect(url).toBe('https://res.cloudinary.com/demo/image/upload/v1/test.jpg');
  });
});
