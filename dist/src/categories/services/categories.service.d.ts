import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        color: string;
        articleCount: number;
    }[]>;
    create(dto: CreateCategoryDto): import(".prisma/client").Prisma.Prisma__CategoryClient<{
        id: string;
        description: string | null;
        createdAt: Date;
        name: string;
        slug: string;
        color: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    update(id: string, dto: UpdateCategoryDto): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        name: string;
        slug: string;
        color: string;
    }>;
    remove(id: string): Promise<void>;
    private ensureExists;
}
