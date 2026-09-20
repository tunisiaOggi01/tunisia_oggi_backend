import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryActiveAdsDto } from '../dto/ads.dto';
import { pickWeighted } from './rotation';

/** Repository-pattern service for public ad serving and impression/click tracking. */
@Injectable()
export class AdsPublicService {
  constructor(private prisma: PrismaService) {}

  async findActive(query: QueryActiveAdsDto) {
    const now = new Date();
    const active = await this.prisma.advertisement.findMany({
      where: {
        placement: query.placement,
        startDate: { lte: now },
        endDate: { gte: now },
      },
    });
    const picked = pickWeighted(active, query.limit ?? 1);
    return picked.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
  }

  async trackImpression(id: string, ip: string) {
    const ad = await this.findActiveById(id);
    try {
      await this.prisma.adImpression.create({
        data: { ip, advertisementId: ad.id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        return ad;
      }
      throw error;
    }
    return this.prisma.advertisement.update({
      where: { id: ad.id },
      data: { impressions: { increment: 1 } },
    });
  }

  async trackClick(id: string, ip: string) {
    const ad = await this.findActiveById(id);
    try {
      await this.prisma.adClick.create({
        data: { ip, advertisementId: ad.id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        return ad;
      }
      throw error;
    }
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
