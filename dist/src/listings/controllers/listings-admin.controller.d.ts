import { ListingsAdminService } from '../services/admin/listings-admin.service';
import { QueryListingsDto } from '../dto/query-listings.dto';
import { UpdateListingDto } from '../dto/update-listing.dto';
export declare class ListingsAdminController {
    private listingsAdminService;
    constructor(listingsAdminService: ListingsAdminService);
    findAll(query: QueryListingsDto): Promise<{
        data: {
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
        }[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    stats(): Promise<{
        pending: number;
        approved: number;
        rejected: number;
        totalViews: number;
        totalClicks: number;
    }>;
    updateStatus(id: string, dto: UpdateListingDto): Promise<{
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
    remove(id: string): Promise<void>;
}
