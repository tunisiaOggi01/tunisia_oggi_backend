import { BusinessCategory } from '@prisma/client';
export declare class CreateListingDto {
    businessName: string;
    category: BusinessCategory;
    description?: string;
    phone: string;
    email: string;
    website?: string;
}
