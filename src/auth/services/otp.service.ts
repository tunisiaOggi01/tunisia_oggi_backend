import { Injectable, BadRequestException } from '@nestjs/common';
import { randomInt } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';

/** Generates and verifies OTP codes for password-reset and email-verification flows. */
@Injectable()
export class OtpService {
  constructor(private prisma: PrismaService) {}

  async generate(email: string): Promise<string> {
    const code = String(randomInt(100000, 999999));
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await this.prisma.otpCode.create({
      data: { email, code, type: 'PASSWORD_RESET', expiresAt },
    });

    return code;
  }

  async verify(email: string, code: string): Promise<void> {
    const otp = await this.prisma.otpCode.findFirst({
      where: { email, code, type: 'PASSWORD_RESET', isUsed: false, expiresAt: { gte: new Date() } },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) throw new BadRequestException('Invalid or expired OTP code');

    await this.prisma.otpCode.update({ where: { id: otp.id }, data: { isUsed: true } });
  }
}
