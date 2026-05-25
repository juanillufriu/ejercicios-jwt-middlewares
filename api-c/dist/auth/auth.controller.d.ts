import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        id: string;
        email: string;
        role: import("../users/user-role.enum").UserRole;
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
    }>;
}
