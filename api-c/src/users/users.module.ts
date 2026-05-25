import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from './user.entity';

import { UsersController } from './controllers/users.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
    ]),
  ],

  controllers: [UsersController],

  exports: [TypeOrmModule],
})
export class UsersModule {}