import { CommentsService } from '../services/comments.service';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
export declare class CommentsController {
    private commentsService;
    constructor(commentsService: CommentsService);
    findByPublication(id: string): Promise<({
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
    create(id: string, dto: CreateCommentDto, user: any): Promise<{
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
    update(id: string, dto: UpdateCommentDto, user: any): Promise<{
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
    remove(id: string, user: any): Promise<void>;
}
