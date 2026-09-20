import type { Response } from 'express';
import { NewsletterAdminService } from '../services/newsletter-admin.service';
import { QuerySubscribersDto } from '../dto/newsletter.dto';
export declare class NewsletterAdminController {
    private newsletterAdminService;
    constructor(newsletterAdminService: NewsletterAdminService);
    findAll(query: QuerySubscribersDto): Promise<{
        data: {
            id: string;
            email: string;
            unsubscribeToken: string;
            confirmedAt: Date | null;
            subscribedAt: Date;
            deletedAt: Date | null;
        }[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    stats(): Promise<{
        active: number;
        newThisWeek: number;
        softDeleted: number;
    }>;
    softDelete(id: string): Promise<void>;
    exportCsv(res: Response): Promise<void>;
}
