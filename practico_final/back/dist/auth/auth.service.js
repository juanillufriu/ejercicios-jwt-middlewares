"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcryptjs");
const crypto_1 = require("crypto");
const user_entity_1 = require("../users/user.entity");
const user_role_enum_1 = require("../users/user-role.enum");
const mail_service_1 = require("../mail/mail.service");
let AuthService = class AuthService {
    usersRepo;
    cfg;
    jwtService;
    mailService;
    constructor(usersRepo, cfg, jwtService, mailService) {
        this.usersRepo = usersRepo;
        this.cfg = cfg;
        this.jwtService = jwtService;
        this.mailService = mailService;
    }
    async register(dto) {
        const email = dto.email.trim().toLowerCase();
        const existing = await this.usersRepo.findOne({ where: { email } });
        if (existing) {
            throw new common_1.ConflictException('El email ya existe');
        }
        const rounds = Number(this.cfg.get('BCRYPT_COST') ?? '12');
        const passwordHash = await bcrypt.hash(dto.password, rounds);
        const countUsers = await this.usersRepo.count();
        const role = countUsers === 0 ? user_role_enum_1.UserRole.ADMIN : user_role_enum_1.UserRole.USER;
        const verificationToken = (0, crypto_1.randomUUID)();
        const entity = this.usersRepo.create({
            email,
            passwordHash,
            role,
            isVerified: false,
            verificationToken,
        });
        const saved = await this.usersRepo.save(entity);
        const link = `${this.frontUrl()}/verify-email?token=${verificationToken}`;
        await this.mailService.sendVerification(email, link);
        const accessToken = this.jwtService.sign({
            sub: saved.id,
            role: saved.role,
        });
        return {
            access_token: accessToken,
            user: {
                id: saved.id,
                email: saved.email,
                role: saved.role,
                isVerified: saved.isVerified,
            },
        };
    }
    async login(dto) {
        const email = dto.email.trim().toLowerCase();
        const user = await this.usersRepo
            .createQueryBuilder('u')
            .addSelect('u.passwordHash')
            .where('u.email = :email', { email })
            .getOne();
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        const ok = await bcrypt.compare(dto.password, user.passwordHash);
        if (!ok) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        const accessToken = this.jwtService.sign({
            sub: user.id,
            role: user.role,
        });
        return {
            access_token: accessToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
            },
        };
    }
    async verifyEmail(token) {
        if (!token) {
            throw new common_1.HttpException({ message: 'Token inválido o expirado' }, common_1.HttpStatus.BAD_REQUEST);
        }
        const user = await this.usersRepo
            .createQueryBuilder('u')
            .addSelect('u.verificationToken')
            .where('u.verificationToken = :token', { token })
            .getOne();
        if (!user) {
            throw new common_1.HttpException({ message: 'Token inválido o expirado' }, common_1.HttpStatus.BAD_REQUEST);
        }
        user.isVerified = true;
        user.verificationToken = null;
        await this.usersRepo.save(user);
        return { message: 'Email verificado' };
    }
    async resendVerification(userId) {
        const user = await this.usersRepo.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        if (user.isVerified) {
            throw new common_1.HttpException({ message: 'El email ya está verificado' }, common_1.HttpStatus.BAD_REQUEST);
        }
        const token = (0, crypto_1.randomUUID)();
        user.verificationToken = token;
        await this.usersRepo.save(user);
        const link = `${this.frontUrl()}/verify-email?token=${token}`;
        await this.mailService.sendVerification(user.email, link);
        return { message: 'Email reenviado' };
    }
    async forgotPassword(dto) {
        const email = dto.email.trim().toLowerCase();
        const user = await this.usersRepo.findOne({ where: { email } });
        if (user) {
            const token = (0, crypto_1.randomUUID)();
            const expiresMin = Number(this.cfg.get('RESET_TOKEN_EXPIRES_MIN') ?? '60');
            user.resetPasswordToken = token;
            user.resetPasswordExpires = new Date(Date.now() + expiresMin * 60 * 1000);
            await this.usersRepo.save(user);
            const link = `${this.frontUrl()}/reset-password?token=${token}`;
            await this.mailService.sendPasswordReset(email, link);
        }
        return { message: 'Si el email existe, recibirás un link' };
    }
    async resetPassword(dto) {
        const user = await this.usersRepo
            .createQueryBuilder('u')
            .addSelect('u.resetPasswordToken')
            .addSelect('u.resetPasswordExpires')
            .where('u.resetPasswordToken = :token', { token: dto.token })
            .andWhere('u.resetPasswordExpires > :now', { now: new Date() })
            .getOne();
        if (!user) {
            throw new common_1.HttpException({ message: 'Token inválido o expirado' }, common_1.HttpStatus.BAD_REQUEST);
        }
        const rounds = Number(this.cfg.get('BCRYPT_COST') ?? '12');
        user.passwordHash = await bcrypt.hash(dto.password, rounds);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await this.usersRepo.save(user);
        return { message: 'Contraseña actualizada' };
    }
    async me(userId) {
        const user = await this.usersRepo.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        return {
            id: user.id,
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
            createdAt: user.createdAt,
        };
    }
    frontUrl() {
        return this.cfg.get('FRONT_URL') ?? 'http://localhost:4200';
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService,
        jwt_1.JwtService,
        mail_service_1.MailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map