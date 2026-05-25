import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { UserRole } from '../users/user-role.enum';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly usersRepo;
    private readonly cfg;
    private readonly jwtService;
    constructor(usersRepo: Repository<UserEntity>, cfg: ConfigService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        id: string;
        email: string;
        role: UserRole;
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
    }>;
}
