import { PrismaService } from '../../../prisma/prisma.service';
import { QueryPublicationsDto } from '../../dto/query-publications.dto';
export declare class PublicationsReaderService {
    private prisma;
    constructor(prisma: PrismaService);
    findPublished(query: QueryPublicationsDto): Promise<{
        data: ({
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
            updatedAt: Date;
            authorId: string;
            categoryId: string;
        })[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findBySlug(slug: string, userId?: string): Promise<{
        reactionCount: number;
        userReaction: string | null;
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
        updatedAt: Date;
        authorId: string;
        categoryId: string;
    }>;
    findTrending(limit?: number): Promise<({
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
        updatedAt: Date;
        authorId: string;
        categoryId: string;
    })[]>;
    findRelated(slug: string): Promise<({
        category: {
            id: string;
            description: string | null;
            createdAt: Date;
            name: string;
            slug: string;
            color: string;
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
        updatedAt: Date;
        authorId: string;
        categoryId: string;
    })[]>;
}
