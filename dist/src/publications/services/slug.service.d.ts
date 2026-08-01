import { PrismaService } from '../../prisma/prisma.service';
export declare class SlugService {
    private prisma;
    constructor(prisma: PrismaService);
    slugify(title: string): string;
    uniqueSlug(title: string): Promise<string>;
}
