import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from '../services/refresh-token.service';

function makePrisma() {
  const tokens: any[] = [];
  const users: any[] = [];
  return {
    refreshToken: {
      create: jest.fn((d: any) => {
        const r = {
          id: String(tokens.length + 1),
          createdAt: new Date(),
          isRevoked: false,
          ...d.data,
        };
        tokens.push(r);
        return Promise.resolve(r);
      }),
      findFirst: jest.fn((q: any) => {
        const match = tokens.find((t) => {
          if (q.where.tokenHash && t.tokenHash !== q.where.tokenHash)
            return false;
          if (q.where.familyId && t.familyId !== q.where.familyId) return false;
          if (
            q.where.isRevoked !== undefined &&
            t.isRevoked !== q.where.isRevoked
          )
            return false;
          return true;
        });
        return Promise.resolve(match ?? null);
      }),
      update: jest.fn((q: any) => {
        const idx = tokens.findIndex((t) => t.id === q.where.id);
        if (idx !== -1) tokens[idx] = { ...tokens[idx], ...q.data };
        return Promise.resolve(tokens[idx]);
      }),
      updateMany: jest.fn((q: any) => {
        tokens.forEach((t) => {
          if (!t.isRevoked) t.isRevoked = true;
        });
        return Promise.resolve({ count: tokens.length });
      }),
      findMany: jest.fn(() => tokens),
    },
    user: {
      findUnique: jest.fn((q: any) => {
        const user = users.find((u) => u.id === q.where.id);
        return Promise.resolve(user ?? null);
      }),
    },
    tokens,
  };
}

function jwtServiceMock() {
  return { sign: jest.fn(() => 'mocked-access-token') } as any;
}

/** The user row the service looks up after rotation. */
function mockUser() {
  return { id: 'user-1', email: 'a@b.com', username: 'a', role: 'EDITOR' };
}

/** Ages every live refresh token beyond the concurrent-rotation grace window. */
function ageLiveTokens(prisma: ReturnType<typeof makePrisma>) {
  rows(prisma).forEach((t: any) => {
    if (!t.isRevoked) t.createdAt = new Date(Date.now() - 5 * 60 * 1000);
  });
}

/** The in-memory token rows the mock persists. */
function rows(prisma: ReturnType<typeof makePrisma>): any[] {
  return prisma.tokens;
}

describe('RefreshTokenService', () => {
  let service: RefreshTokenService;
  let prisma: ReturnType<typeof makePrisma>;
  let jwt: JwtService;

  beforeEach(() => {
    prisma = makePrisma();
    jwt = jwtServiceMock();
    service = new RefreshTokenService(prisma as any, jwt);
    (prisma as any).user.findUnique.mockResolvedValue(mockUser());
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
    it('throws for an unknown token', async () => {
      await expect(service.rotate('badtoken')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('returns a new access token, csrf token, and refresh token', async () => {
      const raw = await service.create('user-1');
      const result = await service.rotate(raw);
      expect(result.accessToken).toBe('mocked-access-token');
      expect(typeof result.csrfToken).toBe('string');
      expect(typeof result.newRefreshToken).toBe('string');
    });

    it('revokes the presented token after rotation', async () => {
      const raw = await service.create('user-2');
      await service.rotate(raw);
      expect(rows(prisma).some((t: any) => t.isRevoked)).toBe(true);
    });

    it('rejects reuse of a revoked token outside the grace window (replay)', async () => {
      const raw = await service.create('user-3');
      await service.rotate(raw);
      ageLiveTokens(prisma);
      await expect(service.rotate(raw)).rejects.toThrow(UnauthorizedException);
    });

    it('tolerates a concurrent rotation from another tab within the grace window', async () => {
      const raw = await service.create('user-4');
      const first = await service.rotate(raw);
      const live = () => rows(prisma).filter((t: any) => !t.isRevoked);
      const family = live()[0].familyId;
      const second = await service.rotate(raw);
      expect(second.accessToken).toBe('mocked-access-token');
      expect(live().some((t: any) => t.familyId !== family)).toBe(true);
      expect(first.newRefreshToken).not.toBe(second.newRefreshToken);
    });

    it('rejects an expired token', async () => {
      const raw = await service.create('user-5');
      rows(prisma)[0].expiresAt = new Date(Date.now() - 1000);
      await expect(service.rotate(raw)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('revoke', () => {
    it('revokes a token by raw value', async () => {
      const raw = await service.create('user-6');
      await service.revoke(raw);
      await expect(service.rotate(raw)).rejects.toThrow(UnauthorizedException);
    });
  });
});
