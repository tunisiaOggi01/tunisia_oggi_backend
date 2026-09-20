import { PublicationsAdminService } from '../services/publications-admin.service';
import { CreatePublicationDto } from '../dto/create-publication.dto';
import { UpdatePublicationDto } from '../dto/update-publication.dto';
import { QueryPublicationsDto } from '../dto/query-publications.dto';
export declare class PublicationsAdminController {
    private publicationsAdminService;
    constructor(publicationsAdminService: PublicationsAdminService);
    create(dto: CreatePublicationDto, user: any): Promise<{
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
    stats(user: any): Promise<{
        totalArticles: number;
        activeDrafts: number;
        totalViews: number;
        comments: number;
    }>;
    findById(id: string, user: any): Promise<{
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
    }>;
    update(id: string, dto: UpdatePublicationDto, user: any): Promise<{
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
    remove(id: string, user: any): Promise<void>;
    findAll(query: QueryPublicationsDto, user: any): Promise<{
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
}
