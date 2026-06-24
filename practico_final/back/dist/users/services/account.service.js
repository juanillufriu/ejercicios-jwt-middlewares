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
exports.AccountService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcryptjs");
const crypto_1 = require("crypto");
const user_entity_1 = require("../user.entity");
const mail_service_1 = require("../../mail/mail.service");
let AccountService = class AccountService {
    usersRepo;
    cfg;
    mailService;
    constructor(usersRepo, cfg, mailService) {
        this.usersRepo = usersRepo;
        this.cfg = cfg;
        this.mailService = mailService;
    }
    async changePassword(userId, dto) {
        const user = await this.usersRepo
            .createQueryBuilder('u')
            .addSelect('u.passwordHash')
            .where('u.id = :id', { id: userId })
            .getOne();
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        const ok = await bcrypt.compare(dto.currentPassword, user.passwordHash);
        if (!ok) {
            throw new common_1.HttpException({ message: 'Contraseña actual incorrecta' }, common_1.HttpStatus.BAD_REQUEST);
        }
        const rounds = Number(this.cfg.get('BCRYPT_COST') ?? '12');
        user.passwordHash = await bcrypt.hash(dto.newPassword, rounds);
        await this.usersRepo.save(user);
        return { message: 'Contraseña actualizada' };
    }
    async changeEmail(userId, dto) {
        const newEmail = dto.newEmail.trim().toLowerCase();
        const user = await this.usersRepo
            .createQueryBuilder('u')
            .addSelect('u.passwordHash')
            .where('u.id = :id', { id: userId })
            .getOne();
        if (!user) {
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        const ok = await bcrypt.compare(dto.currentPassword, user.passwordHash);
        if (!ok) {
            throw new common_1.HttpException({ message: 'Contraseña actual incorrecta' }, common_1.HttpStatus.BAD_REQUEST);
        }
        if (newEmail === user.email) {
            throw new common_1.HttpException({ message: 'El email nuevo es igual al actual' }, common_1.HttpStatus.BAD_REQUEST);
        }
        const taken = await this.usersRepo.findOne({ where: { email: newEmail } });
        if (taken) {
            throw new common_1.ConflictException('El email ya está en uso');
        }
        const verificationToken = (0, crypto_1.randomUUID)();
        user.email = newEmail;
        user.isVerified = false;
        user.verificationToken = verificationToken;
        await this.usersRepo.save(user);
        const frontUrl = this.cfg.get('FRONT_URL') ?? 'http://localhost:4200';
        const link = `${frontUrl}/verify-email?token=${verificationToken}`;
        await this.mailService.sendVerification(newEmail, link);
        return { message: 'Email actualizado, verificá tu nueva dirección' };
    }
};
exports.AccountService = AccountService;
exports.AccountService = AccountService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService,
        mail_service_1.MailService])
], AccountService);
//# sourceMappingURL=account.service.js.map