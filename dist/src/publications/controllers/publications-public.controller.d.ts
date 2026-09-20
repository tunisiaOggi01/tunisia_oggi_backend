import { PublicationsReaderService } from '../services/public/publications-reader.service';
import { PublicationsInteractionService } from '../services/public/publications-interaction.service';
import { QueryPublicationsDto } from '../dto/query-publications.dto';
export declare class PublicationsPublicController {
    private reader;
    private interaction;
    constructor(reader: PublicationsReaderService, interaction: PublicationsInteractionService);
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
            searchText: string;
            updatedAt: Date;
            authorId: string;
            categoryId: string;
        })[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findTrending(): Promise<({
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
    })[]>;
    findMyReactions(user: any): Promise<({
        publication: {
            category: {
                id: string;
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
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        type: string;
        publicationId: string;
    })[]>;
    findBySlug(slug: string): Promise<{
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
        searchText: string;
        updatedAt: Date;
        authorId: string;
        categoryId: string;
    }>;
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
        searchText: string;
        updatedAt: Date;
        authorId: string;
        categoryId: string;
    })[]>;
    view(id: string, user: any): Promise<{
        viewed: boolean;
        views?: undefined;
        rankScore?: undefined;
    } | {
        viewed: boolean;
        views: number;
        rankScore: number;
    }>;
    react(id: string, type: string, user: any): Promise<{
        reacted: boolean;
        type: string;
        reactionCount?: undefined;
    } | {
        reacted: boolean;
        type: string;
        reactionCount: number;
    }>;
    unreact(id: string, user: any): Promise<{
        unreacted: boolean;
        reactionCount?: undefined;
    } | {
        unreacted: boolean;
        reactionCount: number;
    }>;
}
