import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '@prisma/client';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        email: string;
        username: string;
        imageUrl: string | null;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
    }[]>;
    updateRole(id: string, role: Role): Promise<{
        id: string;
        email: string;
        username: string;
        imageUrl: string | null;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
    }>;
    remove(id: string): Promise<void>;
    private ensureExists;
}
