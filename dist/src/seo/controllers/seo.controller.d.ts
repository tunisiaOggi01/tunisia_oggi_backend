import { SeoService } from '../services/seo.service';
export declare class SeoController {
    private seoService;
    constructor(seoService: SeoService);
    robots(): string;
    sitemap(): Promise<string>;
}
