import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { ConfigService } from '@nestjs/config';

import { JwtService } from '@nestjs/jwt';

import { Repository } from 'typeorm';

import * as bcrypt from 'bcryptjs';

import { randomUUID } from 'crypto';

import { UserEntity } from '../users/user.entity';

import { UserRole } from '../users/user-role.enum';

import { RegisterDto } from './dto/register.dto';

import { LoginDto } from './dto/login.dto';

import { ForgotPasswordDto } from './dto/forgot-password.dto';

import { ResetPasswordDto } from './dto/reset-password.dto';

import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,

    private readonly cfg: ConfigService,

    private readonly jwtService: JwtService,

    private readonly mailService: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();

    const existing = await this.usersRepo.findOne({ where: { email } });

    if (existing) {
      throw new ConflictException('El email ya existe');
    }

    const rounds = Number(
      this.cfg.get<string>('BCRYPT_COST') ?? '12',
    );

    const passwordHash = await bcrypt.hash(dto.password, rounds);

    const countUsers = await this.usersRepo.count();

    const role = countUsers === 0 ? UserRole.ADMIN : UserRole.USER;

    const verificationToken = randomUUID();

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

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();

    const user = await this.usersRepo
      .createQueryBuilder('u')
      .addSelect('u.passwordHash')
      .where('u.email = :email', { email })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const ok = await bcrypt.compare(dto.password, user.passwordHash);

    if (!ok) {
      throw new UnauthorizedException('Credenciales inválidas');
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

  async verifyEmail(token: string) {
    if (!token) {
      throw new HttpException(
        { message: 'Token inválido o expirado' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.usersRepo
      .createQueryBuilder('u')
      .addSelect('u.verificationToken')
      .where('u.verificationToken = :token', { token })
      .getOne();

    if (!user) {
      throw new HttpException(
        { message: 'Token inválido o expirado' },
        HttpStatus.BAD_REQUEST,
      );
    }

    user.isVerified = true;
    user.verificationToken = null;

    await this.usersRepo.save(user);

    return { message: 'Email verificado' };
  }

  async resendVerification(userId: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (user.isVerified) {
      throw new HttpException(
        { message: 'El email ya está verificado' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const token = randomUUID();
    user.verificationToken = token;

    await this.usersRepo.save(user);

    const link = `${this.frontUrl()}/verify-email?token=${token}`;

    await this.mailService.sendVerification(user.email, link);

    return { message: 'Email reenviado' };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const email = dto.email.trim().toLowerCase();

    const user = await this.usersRepo.findOne({ where: { email } });

    if (user) {
      const token = randomUUID();

      const expiresMin = Number(
        this.cfg.get<string>('RESET_TOKEN_EXPIRES_MIN') ?? '60',
      );

      user.resetPasswordToken = token;
      user.resetPasswordExpires = new Date(Date.now() + expiresMin * 60 * 1000);

      await this.usersRepo.save(user);

      const link = `${this.frontUrl()}/reset-password?token=${token}`;

      await this.mailService.sendPasswordReset(email, link);
    }

    return { message: 'Si el email existe, recibirás un link' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.usersRepo
      .createQueryBuilder('u')
      .addSelect('u.resetPasswordToken')
      .addSelect('u.resetPasswordExpires')
      .where('u.resetPasswordToken = :token', { token: dto.token })
      .andWhere('u.resetPasswordExpires > :now', { now: new Date() })
      .getOne();

    if (!user) {
      throw new HttpException(
        { message: 'Token inválido o expirado' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const rounds = Number(
      this.cfg.get<string>('BCRYPT_COST') ?? '12',
    );

    user.passwordHash = await bcrypt.hash(dto.password, rounds);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await this.usersRepo.save(user);

    return { message: 'Contraseña actualizada' };
  }

  async me(userId: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    };
  }

  private frontUrl(): string {
    return this.cfg.get<string>('FRONT_URL') ?? 'http://localhost:4200';
  }
}
