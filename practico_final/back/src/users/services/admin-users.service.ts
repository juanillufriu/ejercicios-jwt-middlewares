import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { UserEntity } from '../user.entity';

import { UserRole } from '../user-role.enum';

@Injectable()
export class AdminUsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
  ) {}

  async findAll() {
    const users = await this.usersRepo.find({
      order: { createdAt: 'ASC' },
    });

    return users.map((u) => ({
      id: u.id,
      email: u.email,
      role: u.role,
      isVerified: u.isVerified,
      createdAt: u.createdAt,
    }));
  }

  async updateRole(
    targetId: string,
    requesterId: string,
    role: UserRole,
  ) {
    const target = await this.usersRepo.findOne({
      where: { id: targetId },
    });

    if (!target) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (target.id === requesterId) {
      throw new ForbiddenException('Cannot change your own role');
    }

    if (
      target.role === UserRole.ADMIN &&
      role === UserRole.USER
    ) {
      const adminCount = await this.usersRepo.count({
        where: { role: UserRole.ADMIN },
      });

      if (adminCount <= 1) {
        throw new ForbiddenException(
          'Cannot demote the only admin',
        );
      }
    }

    target.role = role;

    await this.usersRepo.save(target);

    return {
      id: target.id,
      email: target.email,
      role: target.role,
      isVerified: target.isVerified,
      createdAt: target.createdAt,
    };
  }
}