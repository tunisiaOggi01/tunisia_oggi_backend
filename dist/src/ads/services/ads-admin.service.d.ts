import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAdDto, UpdateAdDto, QueryAdsDto, QueryAdLogsDto } from '../dto/ads.dto';
export type AdStatus = 'PROGRAMMATA' | 'ATTIVA' | 'SCADUTA';
interface AdminInfo {
    username: string;
    email: string;
}
export declare class AdsAdminService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateAdDto, admin: AdminInfo): Promise<{
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
    findAll(query: QueryAdsDto): Promise<{
        data: {
            status: AdStatus;
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
    remove(id: string, admin: AdminInfo): Promise<void>;
    update(id: string, dto: UpdateAdDto, admin: AdminInfo): Promise<{
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
    private log;
    findLogs(query: QueryAdLogsDto): Promise<{
        data: {
            id: string;
            createdAt: Date;
            action: string;
            advertisementId: string | null;
            adminName: string;
            adminEmail: string;
            adTitle: string;
            changes: Prisma.JsonValue | null;
        }[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    private ensureExists;
}
export declare function deriveStatus(startDate: Date, endDate: Date): AdStatus;
export {};
