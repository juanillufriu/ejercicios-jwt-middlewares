import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { UserEntity } from './user.entity';
import { UsersController } from './controllers/users.controller';
import { AccountController } from './controllers/account.controller';
import { AccountService } from './services/account.service';
import { AdminUsersService } from './services/admin-users.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    ConfigModule,
    PassportModule,
    MailModule,
  ],

  controllers: [UsersController, AccountController],

  providers: [AccountService, AdminUsersService],

  exports: [TypeOrmModule],
})
export class UsersModule {}