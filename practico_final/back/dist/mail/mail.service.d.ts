import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private readonly cfg;
    private readonly logger;
    private readonly resend;
    private readonly from;
    constructor(cfg: ConfigService);
    sendPasswordReset(email: string, resetLink: string): Promise<void>;
    sendVerification(email: string, verifyLink: string): Promise<void>;
    private send;
}
