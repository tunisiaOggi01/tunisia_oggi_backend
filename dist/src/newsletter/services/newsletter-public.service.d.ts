import { PrismaService } from '../../prisma/prisma.service';
import { SubscribeNewsletterDto } from '../dto/newsletter.dto';
export declare class NewsletterPublicService {
    private prisma;
    constructor(prisma: PrismaService);
    subscribe(dto: SubscribeNewsletterDto): Promise<{
        id: string;
        email: string;
        unsubscribeToken: string;
        confirmedAt: Date | null;
        subscribedAt: Date;
        deletedAt: Date | null;
    }>;
}
