import { AdPlacement } from '@prisma/client';
export declare class CreateAdDto {
    title: string;
    imageUrl: string;
    linkUrl: string;
    placement: AdPlacement;
    advertiserName?: string;
    advertiserEmail?: string;
    maxImpressions?: number;
    startDate: string;
    endDate: string;
}
export declare class UpdateAdDto {
    title?: string;
    imageUrl?: string;
    linkUrl?: string;
    placement?: AdPlacement;
    advertiserName?: string;
    advertiserEmail?: string;
    maxImpressions?: number;
    startDate?: string;
    endDate?: string;
}
export declare class QueryAdsDto {
    placement?: AdPlacement;
    page?: number;
    pageSize?: number;
}
export declare class QueryActiveAdsDto {
    placement: AdPlacement;
    limit?: number;
}
export declare class QueryAdLogsDto {
    page?: number;
    pageSize?: number;
}
