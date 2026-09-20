import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateAdDto,
  UpdateAdDto,
  QueryAdsDto,
  QueryAdLogsDto,
} from '../dto/ads.dto';

export type AdStatus = 'PROGRAMMATA' | 'ATTIVA' | 'SCADUTA';

interface AdminInfo {
  username: string;
  email: string;
}

@Injectable()
export class AdsAdminService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateAdDto, admin: AdminInfo) {
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);
    if (endDate <= startDate) {
      throw new BadRequestException('endDate must be after startDate');
    }
    const ad = await this.prisma.advertisement.create({
      data: {
        title: dto.title,
        imageUrl: dto.imageUrl,
        linkUrl: dto.linkUrl,
        placement: dto.placement,
        advertiserName: dto.advertiserName,
        advertiserEmail: dto.advertiserEmail,
        maxImpressions: dto.maxImpressions,
        startDate,
        endDate,
      },
    });
    await this.log(admin, 'CREATE', ad.title, ad.id);
    return ad;
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
        budgetExhausted:
          ad.maxImpressions !== null && ad.impressions >= ad.maxImpressions,
        remainingImpressions:
          ad.maxImpressions === null
            ? null
            : Math.max(0, ad.maxImpressions - ad.impressions),
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

  async remove(id: string, admin: AdminInfo) {
    const ad = await this.ensureExists(id);
    await this.log(admin, 'DELETE', ad.title, ad.id);
    await this.prisma.advertisement.delete({ where: { id } });
  }

  async update(id: string, dto: UpdateAdDto, admin: AdminInfo) {
    const ad = await this.ensureExists(id);
    const status = deriveStatus(ad.startDate, ad.endDate);
    if (status === 'SCADUTA') {
      throw new BadRequestException('Cannot modify an expired ad');
    }
    if (status === 'ATTIVA' && dto.startDate) {
      throw new BadRequestException('Cannot change start date of a running ad');
    }
    const changes: Record<string, { from: unknown; to: unknown }> = {};
    if (dto.title !== undefined && dto.title !== ad.title)
      changes.title = { from: ad.title, to: dto.title };
    if (dto.imageUrl !== undefined && dto.imageUrl !== ad.imageUrl)
      changes.imageUrl = { from: ad.imageUrl, to: dto.imageUrl };
    if (dto.linkUrl !== undefined && dto.linkUrl !== ad.linkUrl)
      changes.linkUrl = { from: ad.linkUrl, to: dto.linkUrl };
    if (dto.placement !== undefined && dto.placement !== ad.placement)
      changes.placement = { from: ad.placement, to: dto.placement };
    if (dto.advertiserName !== ad.advertiserName)
      changes.advertiserName = {
        from: ad.advertiserName,
        to: dto.advertiserName ?? null,
      };
    if (dto.advertiserEmail !== ad.advertiserEmail)
      changes.advertiserEmail = {
        from: ad.advertiserEmail,
        to: dto.advertiserEmail ?? null,
      };
    if (
      dto.maxImpressions !== undefined &&
      dto.maxImpressions !== ad.maxImpressions
    )
      changes.maxImpressions = {
        from: ad.maxImpressions,
        to: dto.maxImpressions,
      };
    if (dto.startDate)
      changes.startDate = {
        from: ad.startDate.toISOString(),
        to: new Date(dto.startDate).toISOString(),
      };
    if (dto.endDate)
      changes.endDate = {
        from: ad.endDate.toISOString(),
        to: new Date(dto.endDate).toISOString(),
      };
    const data: Record<string, unknown> = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.imageUrl !== undefined) data.imageUrl = dto.imageUrl;
    if (dto.linkUrl !== undefined) data.linkUrl = dto.linkUrl;
    if (dto.placement !== undefined) data.placement = dto.placement;
    if (dto.advertiserName !== undefined)
      data.advertiserName = dto.advertiserName;
    if (dto.advertiserEmail !== undefined)
      data.advertiserEmail = dto.advertiserEmail;
    if (dto.maxImpressions !== undefined)
      data.maxImpressions = dto.maxImpressions;
    if (dto.startDate !== undefined) data.startDate = new Date(dto.startDate);
    if (dto.endDate !== undefined) data.endDate = new Date(dto.endDate);
    if (
      data.startDate &&
      data.endDate &&
      (data.endDate as Date) <= (data.startDate as Date)
    ) {
      throw new BadRequestException('endDate must be after startDate');
    }
    if (Object.keys(changes).length > 0) {
      await this.log(admin, 'UPDATE', ad.title, ad.id, changes);
    }
    return this.prisma.advertisement.update({ where: { id }, data });
  }

  private async log(
    admin: AdminInfo,
    action: string,
    adTitle: string,
    advertisementId: string,
    changes?: Record<string, { from: unknown; to: unknown }>,
  ) {
    return this.prisma.adLog.create({
      data: {
        adminName: admin.username,
        adminEmail: admin.email,
        action,
        adTitle,
        advertisementId,
        changes: (changes ?? undefined) as unknown as
          Prisma.InputJsonValue | undefined,
      },
    });
  }

  async findLogs(query: QueryAdLogsDto) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const [data, total] = await Promise.all([
      this.prisma.adLog.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.adLog.count(),
    ]);
    return { data, total, page, pageSize };
  }

  private async ensureExists(id: string) {
    const found = await this.prisma.advertisement.findUnique({ where: { id } });
    if (!found) throw new NotFoundException('Ad not found');
    return found;
  }
}

/** Computes the display status from the date window — SCADUTA past end, PROGRAMMATA before start. */
export function deriveStatus(startDate: Date, endDate: Date): AdStatus {
  const now = new Date();
  if (endDate < now) return 'SCADUTA';
  if (startDate > now) return 'PROGRAMMATA';
  return 'ATTIVA';
}
