import { BadRequestException } from '@nestjs/common';
import { OtpService } from '../services/otp.service';

function makePrisma() {
  const store: any[] = [];
  return {
    otpCode: {
      create: jest.fn((d: any) => {
        const r = { id: String(store.length + 1), ...d.data };
        store.push(r);
        return Promise.resolve(r);
      }),
      findFirst: jest.fn((q: any) => {
        const match = store.find(
          (o) =>
            o.email === q.where.email &&
            o.code === q.where.code &&
            o.type === q.where.type &&
            !o.isUsed &&
            new Date(o.expiresAt) >= new Date(),
        );
        return Promise.resolve(match ?? null);
      }),
      update: jest.fn((q: any) => {
        const idx = store.findIndex((o: any) => o.id === q.where.id);
        if (idx !== -1) Object.assign(store[idx], q.data);
        return Promise.resolve(q.data);
      }),
    },
  };
}

describe('OtpService', () => {
  let service: OtpService;
  let prisma: ReturnType<typeof makePrisma>;

  beforeEach(() => {
    prisma = makePrisma();
    service = new OtpService(prisma as any);
  });

  it('generates a 6-digit OTP code', async () => {
    const code = await service.generate('test@example.com');
    expect(code).toMatch(/^\d{6}$/);
  });

  it('verifies a valid OTP code', async () => {
    const code = await service.generate('verify@example.com');
    await expect(
      service.verify('verify@example.com', code),
    ).resolves.toBeUndefined();
  });

  it('rejects an invalid OTP code', async () => {
    await service.generate('wrong@example.com');
    await expect(service.verify('wrong@example.com', '000000')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('rejects verification for a non-existent email', async () => {
    await expect(
      service.verify('nonexist@example.com', '123456'),
    ).rejects.toThrow(BadRequestException);
  });

  it('marks a code as used after successful verification', async () => {
    const code = await service.generate('used@example.com');
    await service.verify('used@example.com', code);
    await expect(service.verify('used@example.com', code)).rejects.toThrow(
      BadRequestException,
    );
  });
});
