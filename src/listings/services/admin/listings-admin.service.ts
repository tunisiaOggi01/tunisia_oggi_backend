import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { QueryListingsDto } from '../../dto/query-listings.dto';
import { UpdateListingDto } from '../../dto/update-listing.dto';

/** Repository-pattern service for the admin directory review workflow. */
@Injectable()
export class ListingsAdminService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryListingsDto) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;
    const where = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.category ? { category: query.category } : {}),
      ...(query.search
        ? {
            searchText: {
              contains: query.search.toLowerCase(),
              mode: 'insensitive' as const,
            },
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.businessListing.findMany({
        where,
        orderBy: { submittedAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.businessListing.count({ where }),
    ]);

    return { data, total, page, pageSize };
  }

  async updateStatus(id: string, dto: UpdateListingDto) {
    await this.ensureExists(id);
    return this.prisma.businessListing.update({
      where: { id },
      data: { status: dto.status, reviewedAt: new Date() },
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.businessListing.delete({ where: { id } });
  }

  async stats() {
    const [pending, approved, rejected, agg] = await Promise.all([
      this.prisma.businessListing.count({ where: { status: 'PENDING' } }),
      this.prisma.businessListing.count({ where: { status: 'APPROVED' } }),
      this.prisma.businessListing.count({ where: { status: 'REJECTED' } }),
      this.prisma.businessListing.aggregate({
        _sum: {
          views: true,
          phoneClicks: true,
          emailClicks: true,
          websiteClicks: true,
        },
      }),
    ]);
    return {
      pending,
      approved,
      rejected,
      totalViews: agg._sum.views ?? 0,
      totalClicks:
        (agg._sum.phoneClicks ?? 0) +
        (agg._sum.emailClicks ?? 0) +
        (agg._sum.websiteClicks ?? 0),
    };
  }

  private async ensureExists(id: string) {
    const found = await this.prisma.businessListing.findUnique({
      where: { id },
    });
    if (!found) throw new NotFoundException('Listing not found');
  }
}
