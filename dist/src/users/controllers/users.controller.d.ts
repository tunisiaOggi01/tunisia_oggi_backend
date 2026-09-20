import { UsersService } from '../services/users.service';
import { UpdateUserRoleDto } from '../dto/update-user-role.dto';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<{
        id: string;
        email: string;
        username: string;
        imageUrl: string | null;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
    }[]>;
    updateRole(id: string, dto: UpdateUserRoleDto): Promise<{
        id: string;
        email: string;
        username: string;
        imageUrl: string | null;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
    }>;
    remove(id: string): Promise<void>;
}
