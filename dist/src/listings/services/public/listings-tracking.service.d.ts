import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { ListingAction } from '../../dto/tracking/click-action.dto';
export declare class ListingsTrackingService {
    private prisma;
    constructor(prisma: PrismaService);
    findById(id: string, ip: string): Promise<{
        id: string;
        email: string;
        description: string | null;
        category: import(".prisma/client").$Enums.BusinessCategory;
        status: import(".prisma/client").$Enums.ListingStatus;
        views: number;
        searchText: string;
        businessName: string;
        phone: string;
        website: string | null;
        submittedAt: Date;
        reviewedAt: Date | null;
        phoneClicks: number;
        emailClicks: number;
        websiteClicks: number;
        createdById: string;
    }>;
    trackClick(id: string, action: ListingAction): Promise<{
        id: string;
        email: string;
        description: string | null;
        category: import(".prisma/client").$Enums.BusinessCategory;
        status: import(".prisma/client").$Enums.ListingStatus;
        views: number;
        searchText: string;
        businessName: string;
        phone: string;
        website: string | null;
        submittedAt: Date;
        reviewedAt: Date | null;
        phoneClicks: number;
        emailClicks: number;
        websiteClicks: number;
        createdById: string;
    }>;
    getMine(userId: string): Prisma.PrismaPromise<{
        id: string;
        email: string;
        description: string | null;
        category: import(".prisma/client").$Enums.BusinessCategory;
        status: import(".prisma/client").$Enums.ListingStatus;
        views: number;
        searchText: string;
        businessName: string;
        phone: string;
        website: string | null;
        submittedAt: Date;
        reviewedAt: Date | null;
        phoneClicks: number;
        emailClicks: number;
        websiteClicks: number;
        createdById: string;
    }[]>;
    getMineStats(id: string, userId: string): Promise<{
        views: number;
        phoneClicks: number;
        emailClicks: number;
        websiteClicks: number;
    }>;
}
