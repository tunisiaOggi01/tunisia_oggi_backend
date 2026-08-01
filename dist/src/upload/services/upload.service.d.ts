import { PrismaService } from '../../prisma/prisma.service';
export declare class UploadService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    uploadImage(file: Express.Multer.File, userId: string): Promise<string>;
}
