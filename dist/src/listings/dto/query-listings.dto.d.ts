import { BusinessCategory, ListingStatus } from '@prisma/client';
export declare class QueryListingsDto {
    status?: ListingStatus;
    category?: BusinessCategory;
    search?: string;
    page?: number;
    pageSize?: number;
}
