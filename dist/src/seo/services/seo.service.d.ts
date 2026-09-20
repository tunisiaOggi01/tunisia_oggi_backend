import { PrismaService } from '../../prisma/prisma.service';
export declare class SeoService {
    private prisma;
    constructor(prisma: PrismaService);
    private get baseUrl();
    robots(): string;
    sitemap(): Promise<string>;
}
