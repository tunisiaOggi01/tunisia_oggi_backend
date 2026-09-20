import { NewsletterPublicService } from '../services/newsletter-public.service';
import { SubscribeNewsletterDto } from '../dto/newsletter.dto';
export declare class NewsletterPublicController {
    private newsletterPublicService;
    constructor(newsletterPublicService: NewsletterPublicService);
    subscribe(dto: SubscribeNewsletterDto): Promise<{
        id: string;
        email: string;
        unsubscribeToken: string;
        confirmedAt: Date | null;
        subscribedAt: Date;
        deletedAt: Date | null;
    }>;
}
