import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { normalizeSearchText } from '../../../common/normalize-search';
import { CreateListingDto } from '../../dto/create-listing.dto';
import { QueryListingsDto } from '../../dto/query-listings.dto';

/** Repository-pattern service for public directory submission and APPROVED-only browsing. */
@Injectable()
export class ListingsPublicService {
  constructor(private prisma: PrismaService) {}

  async submit(dto: CreateListingDto, userId: string) {
    const existing = await this.prisma.businessListing.findFirst({
      where: {
        businessName: dto.businessName,
        phone: dto.phone.trim(),
      },
    });
    if (existing) {
      throw new ConflictException(
        'A listing with this business name and phone already exists',
      );
    }
    return this.prisma.businessListing.create({
      data: {
        businessName: dto.businessName,
        category: dto.category,
        description: dto.description,
        phone: dto.phone.trim(),
        email: dto.email.trim().toLowerCase(),
        website: dto.website,
        status: 'PENDING',
        createdById: userId,
        searchText: normalizeSearchText(
          `${dto.businessName} ${dto.description ?? ''} ${dto.phone} ${dto.email}`,
        ),
      },
    });
  }

  findApproved(query: QueryListingsDto) {
    return this.prisma.businessListing.findMany({
      where: {
        status: 'APPROVED',
        ...(query.category ? { category: query.category } : {}),
        ...(query.search
          ? {
              searchText: {
                contains: query.search.toLowerCase(),
                mode: 'insensitive' as const,
              },
            }
          : {}),
      },
      orderBy: { businessName: 'asc' },
    });
  }
}
