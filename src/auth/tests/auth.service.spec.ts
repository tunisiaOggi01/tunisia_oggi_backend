/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return */
import { AuthService } from '../services/auth.service';
import bcrypt from 'bcrypt';

function makePrisma() {
  const users: any[] = [
    {
      id: 'u1',
      email: 'admin@test.it',
      username: 'admin',
      passwordHash: '$2b$10$abcdefghijklmnopqrstuv',
      role: 'SUPER_ADMIN',
    },
  ];
  return {
    user: {
      create: jest.fn((q: any) => {
        const user = { id: 'u2', createdAt: new Date(), ...q.data };
        users.push(user);
        return Promise.resolve(user);
      }),
      findUnique: jest.fn((q: any) =>
        Promise.resolve(users.find((u) => u.email === q.where.email) ?? null),
      ),
      update: jest.fn((q: any) => {
        const idx = users.findIndex((u) => u.email === q.where.email);
        if (idx !== -1) users[idx] = { ...users[idx], ...q.data };
        return Promise.resolve(users[idx]);
      }),
      findFirst: jest.fn((q: any) =>
        Promise.resolve(
          users.find((u) =>
            (q.where.OR ?? []).some(
              (c: any) =>
                (c.email && u.email === c.email) ||
                (c.username && u.username === c.username),
            ),
          ) ?? null,
        ),
      ),
    },
    refreshToken: { updateMany: jest.fn(() => Promise.resolve({ count: 0 })) },
  };
}

function makeService() {
  const prisma = makePrisma();
  const refreshTokenService = {
    create: jest.fn(() => Promise.resolve('raw-refresh-token')),
    revokeAll: jest.fn(() => Promise.resolve()),
  } as any;
  const otpService = {
    generate: jest.fn(() => Promise.resolve()),
    verify: jest.fn(() => Promise.resolve()),
  } as any;
  const jwtService = { sign: jest.fn(() => 'mocked-access-token') } as any;
  const service = new AuthService(
    prisma as any,
    jwtService,
    refreshTokenService,
    otpService,
  );
  return { prisma, service, refreshTokenService, otpService };
}

describe('AuthService', () => {
  describe('register', () => {
    it('creates the user with the VISITOR role', async () => {
      const { prisma, service } = makeService();
      await service.register('reader@test.it', 'reader1', 'Password123!');
      const createCall = prisma.user.create.mock.calls[0][0];
      expect(createCall.data.role).toBe('VISITOR');
    });

    it('stores a bcrypt hash of the password', async () => {
      const { prisma, service } = makeService();
      await service.register('reader@test.it', 'reader1', 'Password123!');
      const createCall = prisma.user.create.mock.calls[0][0];
      expect(
        await bcrypt.compare('Password123!', createCall.data.passwordHash),
      ).toBe(true);
    });
  });

  describe('resetPassword', () => {
    it('revokes every refresh token of the user', async () => {
      const { service, refreshTokenService } = makeService();
      await service.resetPassword('admin@test.it', '123456', 'NewPassword123!');
      expect(refreshTokenService.revokeAll).toHaveBeenCalledWith('u1');
    });

    it('verifies the OTP before updating the hash', async () => {
      const { prisma, service, otpService } = makeService();
      await service.resetPassword('admin@test.it', '123456', 'NewPassword123!');
      expect(otpService.verify).toHaveBeenCalledWith('admin@test.it', '123456');
      expect(prisma.user.update).toHaveBeenCalled();
    });
  });
});
