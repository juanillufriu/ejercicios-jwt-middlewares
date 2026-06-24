import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { UserEntity } from '../user.entity';
import { MailService } from '../../mail/mail.service';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { ChangeEmailDto } from '../dto/change-email.dto';
export declare class AccountService {
    private readonly usersRepo;
    private readonly cfg;
    private readonly mailService;
    constructor(usersRepo: Repository<UserEntity>, cfg: ConfigService, mailService: MailService);
    changePassword(userId: string, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    changeEmail(userId: string, dto: ChangeEmailDto): Promise<{
        message: string;
    }>;
}
