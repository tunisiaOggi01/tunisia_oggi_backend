import { SearchPublicService } from '../services/search-public.service';
import { QuerySearchDto } from '../dto/search.dto';
export declare class SearchPublicController {
    private searchPublicService;
    constructor(searchPublicService: SearchPublicService);
    search(query: QuerySearchDto): Promise<{
        data: {
            articles: ({
                category: {
                    id: string;
                    description: string | null;
                    createdAt: Date;
                    name: string;
                    slug: string;
                    color: string;
                };
                author: {
                    id: string;
                    username: string;
                    imageUrl: string | null;
                };
            } & {
                id: string;
                createdAt: Date;
                slug: string;
                title: string;
                body: string;
                status: import(".prisma/client").$Enums.PublicationStatus;
                publishedAt: Date | null;
                scheduledAt: Date | null;
                featuredImageUrl: string | null;
                views: number;
                likes: number;
                rankScore: number;
                tags: string[];
                searchText: string;
                updatedAt: Date;
                authorId: string;
                categoryId: string;
            })[];
            totalArticles: number;
            page: number;
            pageSize: number;
            listings: {
                id: string;
                email: string;
                description: string | null;
                category: import(".prisma/client").$Enums.BusinessCategory;
                status: import(".prisma/client").$Enums.ListingStatus;
                views: number;
                searchText: string;
                businessName: string;
                phone: string;
                website: string | null;
                submittedAt: Date;
                reviewedAt: Date | null;
                phoneClicks: number;
                emailClicks: number;
                websiteClicks: number;
                createdById: string;
            }[];
            categoryCounts: {
                count: number;
                id?: string | undefined;
                name?: string | undefined;
                slug?: string | undefined;
            }[];
        };
    }>;
}
