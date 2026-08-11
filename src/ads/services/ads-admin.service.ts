import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAdDto, QueryAdsDto } from '../dto/ads.dto';

/** Derived ad lifecycle status, computed from dates at query time — no cron, no toggle. */
export type AdStatus = 'PROGRAMMATA' | 'ATTIVA' | 'SCADUTA';

/** Repository-pattern service for the admin ad manager: create, paginated list, stats, hard delete. */
@Injectable()
export class AdsAdminService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAdDto) {
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);
    if (endDate <= startDate) {
      throw new BadRequestException('endDate must be after startDate');
    }
    return this.prisma.advertisement.create({
      data: {
        title: dto.title,
        imageUrl: dto.imageUrl,
        linkUrl: dto.linkUrl,
        placement: dto.placement,
        advertiserName: dto.advertiserName,
        advertiserEmail: dto.advertiserEmail,
        startDate,
        endDate,
      },
    });
  }

  async findAll(query: QueryAdsDto) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;
    const where = query.placement ? { placement: query.placement } : {};

    const [data, total] = await Promise.all([
      this.prisma.advertisement.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.advertisement.count({ where }),
    ]);

    return {
      data: data.map((ad) => ({
        ...ad,
        status: deriveStatus(ad.startDate, ad.endDate),
      })),
      total,
      page,
      pageSize,
    };
  }

  async stats() {
    const now = new Date();
    const [scheduled, active, expired, agg] = await Promise.all([
      this.prisma.advertisement.count({ where: { startDate: { gt: now } } }),
      this.prisma.advertisement.count({
        where: { startDate: { lte: now }, endDate: { gte: now } },
      }),
      this.prisma.advertisement.count({ where: { endDate: { lt: now } } }),
      this.prisma.advertisement.aggregate({
        _sum: { impressions: true, clicks: true },
      }),
    ]);
    return {
      scheduled,
      active,
      expired,
      totalImpressions: agg._sum.impressions ?? 0,
      totalClicks: agg._sum.clicks ?? 0,
    };
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.advertisement.delete({ where: { id } });
  }

  private async ensureExists(id: string) {
    const found = await this.prisma.advertisement.findUnique({ where: { id } });
    if (!found) throw new NotFoundException('Ad not found');
  }
}

/** Computes the display status from the date window — SCADUTA past end, PROGRAMMATA before start. */
export function deriveStatus(startDate: Date, endDate: Date): AdStatus {
  const now = new Date();
  if (endDate < now) return 'SCADUTA';
  if (startDate > now) return 'PROGRAMMATA';
  return 'ATTIVA';
}
