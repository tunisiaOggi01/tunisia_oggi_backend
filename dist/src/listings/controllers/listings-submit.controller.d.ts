import { ListingsPublicService } from '../services/public/listings-public.service';
import { ListingsTrackingService } from '../services/public/listings-tracking.service';
import { CreateListingDto } from '../dto/create-listing.dto';
interface RequestUser {
    id: string;
}
export declare class ListingsSubmitController {
    private listingsPublicService;
    private listingsTrackingService;
    constructor(listingsPublicService: ListingsPublicService, listingsTrackingService: ListingsTrackingService);
    submit(dto: CreateListingDto, user: RequestUser): Promise<{
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
    getMine(user: RequestUser): import(".prisma/client").Prisma.PrismaPromise<{
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
    getMineStats(id: string, user: RequestUser): Promise<{
        views: number;
        phoneClicks: number;
        emailClicks: number;
        websiteClicks: number;
    }>;
}
export {};
