import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { ConfigService } from '@nestjs/config';

import { Repository } from 'typeorm';

import * as bcrypt from 'bcryptjs';

import { randomUUID } from 'crypto';

import { UserEntity } from '../user.entity';

import { MailService } from '../../mail/mail.service';

import { ChangePasswordDto } from '../dto/change-password.dto';

import { ChangeEmailDto } from '../dto/change-email.dto';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,

    private readonly cfg: ConfigService,

    private readonly mailService: MailService,
  ) {}

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.usersRepo
      .createQueryBuilder('u')
      .addSelect('u.passwordHash')
      .where('u.id = :id', { id: userId })
      .getOne();

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const ok = await bcrypt.compare(dto.currentPassword, user.passwordHash);

    if (!ok) {
      throw new HttpException(
        { message: 'Contraseña actual incorrecta' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const rounds = Number(
      this.cfg.get<string>('BCRYPT_COST') ?? '12',
    );

    user.passwordHash = await bcrypt.hash(dto.newPassword, rounds);

    await this.usersRepo.save(user);

    return { message: 'Contraseña actualizada' };
  }

  async changeEmail(userId: string, dto: ChangeEmailDto) {
    const newEmail = dto.newEmail.trim().toLowerCase();

    const user = await this.usersRepo
      .createQueryBuilder('u')
      .addSelect('u.passwordHash')
      .where('u.id = :id', { id: userId })
      .getOne();

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const ok = await bcrypt.compare(dto.currentPassword, user.passwordHash);

    if (!ok) {
      throw new HttpException(
        { message: 'Contraseña actual incorrecta' },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (newEmail === user.email) {
      throw new HttpException(
        { message: 'El email nuevo es igual al actual' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const taken = await this.usersRepo.findOne({ where: { email: newEmail } });

    if (taken) {
      throw new ConflictException('El email ya está en uso');
    }

    const verificationToken = randomUUID();

    user.email = newEmail;
    user.isVerified = false;
    user.verificationToken = verificationToken;

    await this.usersRepo.save(user);

    const frontUrl =
      this.cfg.get<string>('FRONT_URL') ?? 'http://localhost:4200';

    const link = `${frontUrl}/verify-email?token=${verificationToken}`;

    await this.mailService.sendVerification(newEmail, link);

    return { message: 'Email actualizado, verificá tu nueva dirección' };
  }
}
