import { PrismaService } from '../../prisma/prisma.service';
export declare class OtpService {
    private prisma;
    constructor(prisma: PrismaService);
    generate(email: string): Promise<string>;
    verify(email: string, code: string): Promise<void>;
}
