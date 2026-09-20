import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { ListingAction } from '../../dto/tracking/click-action.dto';

const CLICK_COUNTERS: Record<ListingAction, string> = {
  PHONE: 'phoneClicks',
  EMAIL: 'emailClicks',
  WEBSITE: 'websiteClicks',
};

/** Repository-pattern service for listing metrics: view/click counters, submitter self-service reads. */
@Injectable()
export class ListingsTrackingService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string, ip: string) {
    const listing = await this.prisma.businessListing.findFirst({
      where: { id, status: 'APPROVED' },
    });
    if (!listing) throw new NotFoundException('Listing not found');

    try {
      await this.prisma.listingView.create({
        data: { ip, listingId: id },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        return listing;
      }
      throw error;
    }

    return this.prisma.businessListing.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
  }

  async trackClick(id: string, action: ListingAction) {
    const listing = await this.prisma.businessListing.findFirst({
      where: { id, status: 'APPROVED' },
    });
    if (!listing) throw new NotFoundException('Listing not found');
    return this.prisma.businessListing.update({
      where: { id },
      data: { [CLICK_COUNTERS[action]]: { increment: 1 } },
    });
  }

  getMine(userId: string) {
    return this.prisma.businessListing.findMany({
      where: { createdById: userId },
      orderBy: { submittedAt: 'desc' },
    });
  }

  async getMineStats(id: string, userId: string) {
    const listing = await this.prisma.businessListing.findUnique({
      where: { id },
    });
    if (!listing) throw new NotFoundException('Listing not found');
    if (listing.createdById !== userId) {
      throw new ForbiddenException('Not your listing');
    }
    return {
      views: listing.views,
      phoneClicks: listing.phoneClicks,
      emailClicks: listing.emailClicks,
      websiteClicks: listing.websiteClicks,
    };
  }
}
