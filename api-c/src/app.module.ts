import {
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';

import { AuthModule } from './auth/auth.module';

import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { TimingMiddleware } from './common/middlewares/timing.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),

    TypeOrmModule.forRoot({
      type: 'sqlite',

      database:
        process.env.SQLITE_DATABASE ??
        './database.sqlite',

      synchronize: true,

      autoLoadEntities: true,
    }),

    ProductsModule,
    UsersModule,
    CategoriesModule,
    AuthModule,
  ],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(
    consumer: MiddlewareConsumer,
  ): void {
    consumer
      .apply(
        LoggerMiddleware,
        TimingMiddleware,
      )
      .forRoutes('*');
  }
}