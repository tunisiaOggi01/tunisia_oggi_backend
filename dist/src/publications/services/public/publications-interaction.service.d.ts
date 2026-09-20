import { PrismaService } from '../../../prisma/prisma.service';
export declare class PublicationsInteractionService {
    private prisma;
    constructor(prisma: PrismaService);
    view(id: string, userId: string): Promise<{
        viewed: boolean;
        views?: undefined;
        rankScore?: undefined;
    } | {
        viewed: boolean;
        views: number;
        rankScore: number;
    }>;
    react(id: string, userId: string, type: string): Promise<{
        reacted: boolean;
        type: string;
        reactionCount?: undefined;
    } | {
        reacted: boolean;
        type: string;
        reactionCount: number;
    }>;
    findMyReactions(userId: string): Promise<({
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
    unreact(id: string, userId: string): Promise<{
        unreacted: boolean;
        reactionCount?: undefined;
    } | {
        unreacted: boolean;
        reactionCount: number;
    }>;
}
