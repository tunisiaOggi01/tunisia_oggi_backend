import { PublicationStatus } from '@prisma/client';
export declare class CreatePublicationDto {
    title: string;
    categoryId: string;
    body: string;
    featuredImageUrl?: string;
    tags?: string[];
    status: PublicationStatus;
    scheduledAt?: string;
}
