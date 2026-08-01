import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { RefreshTokenService } from './refresh-token.service';
import { OtpService } from './otp.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private refreshTokenService: RefreshTokenService,
    private otpService: OtpService,
  ) {}

  private mapUser(user: any) {
    return { id: user.id, email: user.email, username: user.username, role: user.role, imageUrl: user.imageUrl, description: user.description, profileCompleted: user.profileCompleted, heardAbout: user.heardAbout };
  }

  async validateAndLogin(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user?.passwordHash) throw new UnauthorizedException('Invalid credentials');
    if (!await bcrypt.compare(password, user.passwordHash)) throw new UnauthorizedException('Invalid credentials');
    const tokens = await this.issueTokens(user.id, user);
    return { ...tokens, user: this.mapUser(user) };
  }

  async register(email: string, username: string, password: string) {
    const existing = await this.prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
    if (existing) throw new ConflictException('Email or username already in use');
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({ data: { email, username, passwordHash, role: 'EDITOR' } });
    const tokens = await this.issueTokens(user.id, user);
    return { ...tokens, user: this.mapUser(user) };
  }

  async updateProfile(userId: string, data: { imageUrl?: string; description?: string }) {
    const user = await this.prisma.user.update({ where: { id: userId }, data: { ...data, profileCompleted: true } });
    return this.mapUser(user);
  }

  async updateHeardAbout(userId: string, source: string) {
    const user = await this.prisma.user.update({ where: { id: userId }, data: { heardAbout: source } });
    return this.mapUser(user);
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User not found');
    return this.mapUser(user);
  }

  /** Initiates password reset. The OTP is stored in the database for verification but never returned to the client — a real email-sending integration would deliver it. */
  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return { message: 'If the email exists, a reset code has been sent.' };
    await this.otpService.generate(email);
    return { message: 'Reset code sent to your email.' };
  }

  async resetPassword(email: string, otpCode: string, newPassword: string) {
    await this.otpService.verify(email, otpCode);
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({ where: { email }, data: { passwordHash } });
  }

  async handleGoogleLogin(profile: { googleId: string; email: string; username: string; imageUrl: string | null }) {
    const existing = await this.prisma.user.findFirst({ where: { OR: [{ googleId: profile.googleId }, { email: profile.email }] } });
    if (existing) {
      if (!existing.googleId) await this.prisma.user.update({ where: { id: existing.id }, data: { googleId: profile.googleId } });
      return existing;
    }
    return this.prisma.user.create({ data: { email: profile.email, username: profile.username, googleId: profile.googleId, imageUrl: profile.imageUrl, role: 'EDITOR' } });
  }

  async issueTokens(userId: string, user: { email: string; username: string; role: string }) {
    const csrf = randomBytes(32).toString('hex');
    const token = this.jwtService.sign({ sub: userId, email: user.email, username: user.username, role: user.role, csrf });
    const refreshToken = await this.refreshTokenService.create(userId);
    return { token, csrfToken: csrf, refreshToken };
  }
}
