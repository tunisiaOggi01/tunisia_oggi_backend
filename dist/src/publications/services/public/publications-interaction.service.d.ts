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
    unreact(id: string, userId: string): Promise<{
        unreacted: boolean;
        reactionCount?: undefined;
    } | {
        unreacted: boolean;
        reactionCount: number;
    }>;
}
