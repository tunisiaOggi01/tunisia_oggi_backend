import { PublicationStatus } from '@prisma/client';
export declare class QueryPublicationsDto {
    status?: PublicationStatus;
    categorySlug?: string;
    search?: string;
    page?: number;
    authorId?: string;
    pageSize?: number;
}
