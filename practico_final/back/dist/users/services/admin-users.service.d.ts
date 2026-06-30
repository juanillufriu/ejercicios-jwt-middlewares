import { Repository } from 'typeorm';
import { UserEntity } from '../user.entity';
import { UserRole } from '../user-role.enum';
export declare class AdminUsersService {
    private readonly usersRepo;
    constructor(usersRepo: Repository<UserEntity>);
    findAll(): Promise<{
        id: string;
        email: string;
        role: UserRole;
        isVerified: boolean;
        createdAt: Date;
    }[]>;
    updateRole(targetId: string, requesterId: string, role: UserRole): Promise<{
        id: string;
        email: string;
        role: UserRole;
        isVerified: boolean;
        createdAt: Date;
    }>;
}
