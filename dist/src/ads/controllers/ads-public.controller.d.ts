import { AdsPublicService } from '../services/ads-public.service';
import { QueryActiveAdsDto } from '../dto/ads.dto';
export declare class AdsPublicController {
    private adsPublicService;
    constructor(adsPublicService: AdsPublicService);
    findActive(query: QueryActiveAdsDto): Promise<{
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
    }[]>;
    trackImpression(id: string, ip: string): Promise<{
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
    trackClick(id: string, ip: string): Promise<{
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
}
