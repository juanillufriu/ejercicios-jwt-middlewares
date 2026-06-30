import { UserRole } from '../user-role.enum';
import { AdminUsersService } from '../services/admin-users.service';
import { UpdateUserRoleDto } from '../dto/update-user-role.dto';
export declare class UsersController {
    private readonly adminUsersService;
    constructor(adminUsersService: AdminUsersService);
    findAllUsers(): Promise<{
        id: string;
        email: string;
        role: UserRole;
        isVerified: boolean;
        createdAt: Date;
    }[]>;
    updateRole(id: string, dto: UpdateUserRoleDto, req: {
        user: {
            id: string;
        };
    }): Promise<{
        id: string;
        email: string;
        role: UserRole;
        isVerified: boolean;
        createdAt: Date;
    }>;
}
