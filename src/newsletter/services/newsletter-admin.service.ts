import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { QuerySubscribersDto } from '../dto/newsletter.dto';

/** Repository-pattern service for the newsletter manager: list, stats, soft delete, CSV export. */
@Injectable()
export class NewsletterAdminService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QuerySubscribersDto) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;
    const where = { deletedAt: null };

    const [data, total] = await Promise.all([
      this.prisma.newsletterSubscriber.findMany({
        where,
        orderBy: { subscribedAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.newsletterSubscriber.count({ where }),
    ]);

    return { data, total, page, pageSize };
  }

  async stats() {
    const weekAgo = new Date(Date.now() - 7 * 86400000);
    const [active, newThisWeek, softDeleted] = await Promise.all([
      this.prisma.newsletterSubscriber.count({ where: { deletedAt: null } }),
      this.prisma.newsletterSubscriber.count({
        where: { deletedAt: null, subscribedAt: { gte: weekAgo } },
      }),
      this.prisma.newsletterSubscriber.count({
        where: { NOT: { deletedAt: null } },
      }),
    ]);
    return { active, newThisWeek, softDeleted };
  }

  async softDelete(id: string) {
    await this.ensureExists(id);
    await this.prisma.newsletterSubscriber.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async exportCsv(): Promise<string> {
    const subscribers = await this.prisma.newsletterSubscriber.findMany({
      where: { deletedAt: null },
      orderBy: { subscribedAt: 'desc' },
      select: { email: true, subscribedAt: true },
    });
    const rows = subscribers
      .map((s) => `${s.email},${s.subscribedAt.toISOString()}`)
      .join('\n');
    return `\uFEFFemail,subscribedAt\n${rows}`;
  }

  private async ensureExists(id: string) {
    const found = await this.prisma.newsletterSubscriber.findUnique({
      where: { id },
    });
    if (!found) throw new NotFoundException('Subscriber not found');
  }
}
