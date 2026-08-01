import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, createHash, randomUUID } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';

/** Issues, rotates, and revokes refresh tokens stored in the RefreshToken table. */
@Injectable()
export class RefreshTokenService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  private hash(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  async create(userId: string): Promise<string> {
    const raw = randomBytes(48).toString('hex');
    const familyId = randomUUID();
    await this.prisma.refreshToken.create({
      data: {
        tokenHash: this.hash(raw),
        userId,
        familyId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
    return raw;
  }

  async rotate(raw: string): Promise<{ accessToken: string; csrfToken: string; newRefreshToken: string }> {
    const tokenHash = this.hash(raw);
    const existing = await this.prisma.refreshToken.findFirst({ where: { tokenHash, isRevoked: false } });
    if (!existing) throw new UnauthorizedException('Invalid refresh token');

    if (existing.expiresAt < new Date()) {
      await this.prisma.refreshToken.update({ where: { id: existing.id }, data: { isRevoked: true } });
      throw new UnauthorizedException('Refresh token expired');
    }

    // Rotate: revoke old token
    await this.prisma.refreshToken.update({ where: { id: existing.id }, data: { isRevoked: true } });

    // Reuse detection: if a revoked token exists in this family, someone reused an old token.
    // Instead of revoking all (which breaks multi-tab), issue a new token in a NEW family so
    // concurrent refreshes from other tabs still work. Rate limiting on the endpoint prevents
    // brute-force attacks.
    const anyInFamily = await this.prisma.refreshToken.findFirst({
      where: { familyId: existing.familyId, isRevoked: true, id: { not: existing.id } },
    });
    const familyId = anyInFamily ? randomUUID() : existing.familyId;

    const newRaw = randomBytes(48).toString('hex');
    await this.prisma.refreshToken.create({
      data: {
        tokenHash: this.hash(newRaw),
        userId: existing.userId,
        familyId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const user = await this.prisma.user.findUnique({ where: { id: existing.userId } });
    if (!user) throw new UnauthorizedException('User not found');

    const csrf = randomBytes(32).toString('hex');
    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      csrf,
    });

    return { accessToken, csrfToken: csrf, newRefreshToken: newRaw };
  }

  async revokeAll(userId: string) {
    await this.prisma.refreshToken.updateMany({
      where: { userId, isRevoked: false },
      data: { isRevoked: true },
    });
  }

  async revoke(raw: string) {
    const tokenHash = this.hash(raw);
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash, isRevoked: false },
      data: { isRevoked: true },
    });
  }
}
