import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryActiveAdsDto } from '../dto/ads.dto';

/** Repository-pattern service for public ad serving and impression/click tracking. */
@Injectable()
export class AdsPublicService {
  constructor(private prisma: PrismaService) {}

  findActive(query: QueryActiveAdsDto) {
    const now = new Date();
    return this.prisma.advertisement.findMany({
      where: {
        placement: query.placement,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      orderBy: { startDate: 'desc' },
      take: query.limit ?? 1,
    });
  }

  async trackImpression(id: string) {
    const ad = await this.findActiveById(id);
    return this.prisma.advertisement.update({
      where: { id: ad.id },
      data: { impressions: { increment: 1 } },
    });
  }

  async trackClick(id: string) {
    const ad = await this.findActiveById(id);
    return this.prisma.advertisement.update({
      where: { id: ad.id },
      data: { clicks: { increment: 1 } },
    });
  }

  private async findActiveById(id: string) {
    const now = new Date();
    const ad = await this.prisma.advertisement.findFirst({
      where: { id, startDate: { lte: now }, endDate: { gte: now } },
    });
    if (!ad) throw new NotFoundException('Ad not found or not active');
    return ad;
  }
}
