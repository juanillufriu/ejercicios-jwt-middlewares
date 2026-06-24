import { AccountService } from '../services/account.service';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { ChangeEmailDto } from '../dto/change-email.dto';
export declare class AccountController {
    private readonly accountService;
    constructor(accountService: AccountService);
    changePassword(req: {
        user: {
            id: string;
        };
    }, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    changeEmail(req: {
        user: {
            id: string;
        };
    }, dto: ChangeEmailDto): Promise<{
        message: string;
    }>;
}
