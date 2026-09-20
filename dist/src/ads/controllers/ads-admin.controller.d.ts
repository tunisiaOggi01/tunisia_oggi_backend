import { AdsAdminService } from '../services/ads-admin.service';
import { CreateAdDto, UpdateAdDto, QueryAdsDto, QueryAdLogsDto } from '../dto/ads.dto';
export declare class AdsAdminController {
    private adsAdminService;
    constructor(adsAdminService: AdsAdminService);
    findAll(query: QueryAdsDto): Promise<{
        data: {
            status: import("../services/ads-admin.service").AdStatus;
            budgetExhausted: boolean;
            remainingImpressions: number | null;
            id: string;
            imageUrl: string;
            createdAt: Date;
            title: string;
            linkUrl: string;
            placement: import(".prisma/client").$Enums.AdPlacement;
            advertiserName: string | null;
            advertiserEmail: string | null;
            maxImpressions: number | null;
            startDate: Date;
            endDate: Date;
            impressions: number;
            clicks: number;
        }[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    stats(): Promise<{
        scheduled: number;
        active: number;
        expired: number;
        totalImpressions: number;
        totalClicks: number;
    }>;
    findLogs(query: QueryAdLogsDto): Promise<{
        data: {
            id: string;
            createdAt: Date;
            action: string;
            advertisementId: string | null;
            adminName: string;
            adminEmail: string;
            adTitle: string;
            changes: import("@prisma/client/runtime/library").JsonValue | null;
        }[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    create(dto: CreateAdDto, user: any): Promise<{
        id: string;
        imageUrl: string;
        createdAt: Date;
        title: string;
        linkUrl: string;
        placement: import(".prisma/client").$Enums.AdPlacement;
        advertiserName: string | null;
        advertiserEmail: string | null;
        maxImpressions: number | null;
        startDate: Date;
        endDate: Date;
        impressions: number;
        clicks: number;
    }>;
    update(id: string, dto: UpdateAdDto, user: any): Promise<{
        id: string;
        imageUrl: string;
        createdAt: Date;
        title: string;
        linkUrl: string;
        placement: import(".prisma/client").$Enums.AdPlacement;
        advertiserName: string | null;
        advertiserEmail: string | null;
        maxImpressions: number | null;
        startDate: Date;
        endDate: Date;
        impressions: number;
        clicks: number;
    }>;
    remove(id: string, user: any): Promise<void>;
}
