import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
export declare class RefreshTokenService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    private hash;
    private tokenRow;
    create(userId: string): Promise<string>;
    rotate(raw: string): Promise<{
        accessToken: string;
        csrfToken: string;
        newRefreshToken: string;
    }>;
    revokeAll(userId: string): Promise<void>;
    revoke(raw: string): Promise<void>;
}
