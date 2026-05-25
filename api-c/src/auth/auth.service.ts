import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { ConfigService } from '@nestjs/config';

import { JwtService } from '@nestjs/jwt';

import { Repository } from 'typeorm';

import * as bcrypt from 'bcryptjs';

import { UserEntity } from '../users/user.entity';

import { UserRole } from '../users/user-role.enum';

import { RegisterDto } from './dto/register.dto';

import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,

    private readonly cfg: ConfigService,

    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email
      .trim()
      .toLowerCase();

    const existing =
      await this.usersRepo.findOne({
        where: { email },
      });

    if (existing) {
      throw new ConflictException(
        'El email ya existe',
      );
    }

    const rounds = Number(
      this.cfg.get<string>(
        'BCRYPT_COST',
      ) ?? '12',
    );

    const passwordHash =
      await bcrypt.hash(
        dto.password,
        rounds,
      );

    const countUsers =
      await this.usersRepo.count();

    const role =
      countUsers === 0
        ? UserRole.ADMIN
        : UserRole.USER;

    const entity =
      this.usersRepo.create({
        email,
        passwordHash,
        role,
      });

    const saved =
      await this.usersRepo.save(entity);

    return {
      id: saved.id,
      email: saved.email,
      role: saved.role,
    };
  }

  async login(dto: LoginDto) {
    const email = dto.email
      .trim()
      .toLowerCase();

    const user = await this.usersRepo
      .createQueryBuilder('u')
      .addSelect('u.passwordHash')
      .where('u.email = :email', {
        email,
      })
      .getOne();

    if (!user) {
      throw new UnauthorizedException(
        'Credenciales inválidas',
      );
    }

    const ok = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!ok) {
      throw new UnauthorizedException(
        'Credenciales inválidas',
      );
    }

    const accessToken =
      this.jwtService.sign({
        sub: user.id,
        role: user.role,
      });

    return {
      access_token: accessToken,
    };
  }
}