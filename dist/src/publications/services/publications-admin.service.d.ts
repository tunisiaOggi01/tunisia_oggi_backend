import { Role } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { HtmlSanitizerService } from '../../common/html-sanitizer.service';
import { CreatePublicationDto } from '../dto/create-publication.dto';
import { UpdatePublicationDto } from '../dto/update-publication.dto';
import { QueryPublicationsDto } from '../dto/query-publications.dto';
import { SlugService } from './slug.service';
export declare class PublicationsAdminService {
    private prisma;
    private slugService;
    private sanitizer;
    constructor(prisma: PrismaService, slugService: SlugService, sanitizer: HtmlSanitizerService);
    create(dto: CreatePublicationDto, authorId: string): Promise<{
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
    findById(id: string, userId: string, userRole: Role): Promise<{
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
    update(id: string, dto: UpdatePublicationDto, userId: string, userRole: Role): Promise<{
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
    remove(id: string, userId: string, userRole: Role): Promise<void>;
    findAll(query: QueryPublicationsDto, userId: string, userRole: Role): Promise<{
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
    private findAllWhere;
    stats(userRole: Role): Promise<{
        totalArticles: number;
        activeDrafts: number;
        totalViews: number;
        comments: number;
    }>;
}
