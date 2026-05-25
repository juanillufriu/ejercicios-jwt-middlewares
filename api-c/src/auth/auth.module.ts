import { Module } from '@nestjs/common';

import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';

import { JwtModule } from '@nestjs/jwt';

import { PassportModule } from '@nestjs/passport';

import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { JwtStrategy } from './strategies/jwt.strategy';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { RolesGuard } from '../common/guards/roles.guard';

import { UserEntity } from '../users/user.entity';

@Module({
  imports: [
    ConfigModule,

    PassportModule.register({
      defaultStrategy: 'jwt',
    }),

    JwtModule.registerAsync({
      imports: [ConfigModule],

      inject: [ConfigService],

      useFactory: (cfg: ConfigService) => ({
        secret: cfg.getOrThrow<string>('JWT_SECRET'),

        signOptions: {
          expiresIn: Number(
            cfg.get<string>('JWT_EXPIRES_SEC') ??
              '3600',
          ),
        },
      }),
    }),

    TypeOrmModule.forFeature([UserEntity]),
  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
  ],

  exports: [
    JwtAuthGuard,
    RolesGuard,
    JwtModule,
  ],
})
export class AuthModule {}