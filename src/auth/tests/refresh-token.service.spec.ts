import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from '../services/refresh-token.service';

function makePrisma() {
  const tokens: any[] = [];
  const users: any[] = [];
  return {
    refreshToken: {
      create: jest.fn((d: any) => { const r = { id: String(tokens.length + 1), ...d.data }; tokens.push(r); return Promise.resolve(r); }),
      findFirst: jest.fn((q: any) => {
        const match = tokens.find((t) => t.tokenHash === q.where.tokenHash && !t.isRevoked);
        return Promise.resolve(match ?? null);
      }),
      update: jest.fn((q: any) => {
        const idx = tokens.findIndex((t) => t.id === q.where.id);
        if (idx !== -1) Object.assign(tokens[idx], q.data);
        return Promise.resolve(tokens[idx]);
      }),
      updateMany: jest.fn((q: any) => {
        tokens.forEach((t) => { if (!t.isRevoked) t.isRevoked = true; });
        return Promise.resolve({ count: tokens.length });
      }),
      findMany: jest.fn(() => Promise.resolve(tokens)),
    },
    user: {
      findUnique: jest.fn((q: any) => {
        const user = users.find((u) => u.id === q.where.id);
        return Promise.resolve(user ?? null);
      }),
    },
  };
}

function jwtServiceMock() {
  return { sign: jest.fn(() => 'mocked-access-token') } as any;
}

describe('RefreshTokenService', () => {
  let service: RefreshTokenService;
  let prisma: ReturnType<typeof makePrisma>;
  let jwt: JwtService;

  beforeEach(() => {
    prisma = makePrisma();
    jwt = jwtServiceMock();
    service = new RefreshTokenService(prisma as any, jwt);
  });

  describe('create', () => {
    it('returns a raw token string', async () => {
      const raw = await service.create('user-id');
      expect(typeof raw).toBe('string');
      expect(raw.length).toBeGreaterThan(0);
    });

    it('stores a hashed token in the database', async () => {
      await service.create('user-id');
      expect(prisma.refreshToken.create).toHaveBeenCalled();
    });
  });

  describe('rotate', () => {
    it('throws for an invalid token', async () => {
      await expect(service.rotate('badtoken')).rejects.toThrow(UnauthorizedException);
    });

    it('returns a new access token, csrf token, and refresh token', async () => {
      const raw = await service.create('user-1');
      (prisma as any).user.findUnique.mockResolvedValue({ id: 'user-1', email: 'a@b.com', username: 'a', role: 'EDITOR' });

      const result = await service.rotate(raw);
      expect(result.accessToken).toBe('mocked-access-token');
      expect(typeof result.csrfToken).toBe('string');
      expect(typeof result.newRefreshToken).toBe('string');
    });

    it('revokes the old token after rotation', async () => {
      const raw = await service.create('user-2');
      (prisma as any).user.findUnique.mockResolvedValue({ id: 'user-2', email: 'b@c.com', username: 'b', role: 'EDITOR' });

      await service.rotate(raw);
      await expect(service.rotate(raw)).rejects.toThrow(UnauthorizedException);
    });

    it('issues a new family on reuse detection', async () => {
      const raw = await service.create('user-3');
      (prisma as any).user.findUnique.mockResolvedValue({ id: 'user-3', email: 'c@d.com', username: 'c', role: 'EDITOR' });

      await service.rotate(raw);
      await expect(service.rotate(raw)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('revoke', () => {
    it('revokes a token by raw value', async () => {
      const raw = await service.create('user-4');
      await service.revoke(raw);
      await expect(service.rotate(raw)).rejects.toThrow(UnauthorizedException);
    });
  });
});
