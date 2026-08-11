import { ConflictException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { SubscribeNewsletterDto } from '../dto/newsletter.dto';

/** Repository-pattern service for public newsletter signups — confirmed at subscribe, no emails sent. */
@Injectable()
export class NewsletterPublicService {
  constructor(private prisma: PrismaService) {}

  async subscribe(dto: SubscribeNewsletterDto) {
    const email = dto.email.toLowerCase();
    const existing = await this.prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing && !existing.deletedAt) {
      throw new ConflictException('Email already subscribed');
    }

    const unsubscribeToken = randomUUID();
    if (existing) {
      return this.prisma.newsletterSubscriber.update({
        where: { id: existing.id },
        data: { deletedAt: null, unsubscribeToken, confirmedAt: new Date() },
      });
    }

    return this.prisma.newsletterSubscriber.create({
      data: { email, unsubscribeToken, confirmedAt: new Date() },
    });
  }
}
