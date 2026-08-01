import { Role } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateCommentDto } from '../dto/update-comment.dto';
export declare class CommentsService {
    private prisma;
    constructor(prisma: PrismaService);
    findByPublication(publicationId: string): Promise<({
        user: {
            id: string;
            username: string;
            imageUrl: string | null;
        };
        replies: ({
            user: {
                id: string;
                username: string;
                imageUrl: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            body: string;
            updatedAt: Date;
            userId: string;
            publicationId: string;
            parentId: string | null;
        })[];
    } & {
        id: string;
        createdAt: Date;
        body: string;
        updatedAt: Date;
        userId: string;
        publicationId: string;
        parentId: string | null;
    })[]>;
    create(body: string, publicationId: string, userId: string, parentId?: string): Promise<{
        user: {
            id: string;
            username: string;
            imageUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        body: string;
        updatedAt: Date;
        userId: string;
        publicationId: string;
        parentId: string | null;
    }>;
    update(id: string, dto: UpdateCommentDto, userId: string, role: Role): Promise<{
        user: {
            id: string;
            username: string;
            imageUrl: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        body: string;
        updatedAt: Date;
        userId: string;
        publicationId: string;
        parentId: string | null;
    }>;
    remove(id: string, userId: string, role: Role): Promise<void>;
}
