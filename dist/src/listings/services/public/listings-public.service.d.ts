import { PrismaService } from '../../../prisma/prisma.service';
import { CreateListingDto } from '../../dto/create-listing.dto';
import { QueryListingsDto } from '../../dto/query-listings.dto';
export declare class ListingsPublicService {
    private prisma;
    constructor(prisma: PrismaService);
    submit(dto: CreateListingDto, userId: string): Promise<{
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
    findApproved(query: QueryListingsDto): import(".prisma/client").Prisma.PrismaPromise<{
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
}
