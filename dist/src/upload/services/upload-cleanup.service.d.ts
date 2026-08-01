import { PrismaService } from '../../prisma/prisma.service';
export declare class UploadCleanupService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    cleanupStaleUploads(): Promise<void>;
}
