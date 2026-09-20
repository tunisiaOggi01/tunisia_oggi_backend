import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, createHash, randomUUID } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { isConcurrentRotation } from './rotation-grace';

/** Issues, rotates, and revokes refresh tokens stored in the RefreshToken table. */
@Injectable()
export class RefreshTokenService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  private hash(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private tokenRow(raw: string, userId: string, familyId: string) {
    return {
      tokenHash: this.hash(raw),
      userId,
      familyId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };
  }

  async create(userId: string): Promise<string> {
    const raw = randomBytes(48).toString('hex');
    await this.prisma.refreshToken.create({
      data: this.tokenRow(raw, userId, randomUUID()),
    });
    return raw;
  }

  /** Rotates a refresh token, tolerating a concurrent rotation from another tab within the grace window. */
  async rotate(raw: string): Promise<{
    accessToken: string;
    csrfToken: string;
    newRefreshToken: string;
  }> {
    const presented = await this.prisma.refreshToken.findFirst({
      where: { tokenHash: this.hash(raw) },
    });
    if (!presented) throw new UnauthorizedException('Invalid refresh token');
    if (presented.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }
    const sibling = presented.isRevoked
      ? await this.prisma.refreshToken.findFirst({
          where: { familyId: presented.familyId, isRevoked: false },
        })
      : null;
    if (presented.isRevoked && (!sibling || !isConcurrentRotation(sibling))) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    if (!presented.isRevoked) {
      await this.prisma.refreshToken.update({
        where: { id: presented.id },
        data: { isRevoked: true },
      });
    }
    const familyId = presented.isRevoked ? randomUUID() : presented.familyId;
    const newRaw = randomBytes(48).toString('hex');
    await this.prisma.refreshToken.create({
      data: this.tokenRow(newRaw, presented.userId, familyId),
    });
    const user = await this.prisma.user.findUnique({
      where: { id: presented.userId },
    });
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
