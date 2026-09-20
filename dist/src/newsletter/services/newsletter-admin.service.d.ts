import { PrismaService } from '../../prisma/prisma.service';
import { QuerySubscribersDto } from '../dto/newsletter.dto';
export declare class NewsletterAdminService {
    private prisma;
    constructor(prisma: PrismaService);
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
    exportCsv(): Promise<string>;
    private ensureExists;
}
