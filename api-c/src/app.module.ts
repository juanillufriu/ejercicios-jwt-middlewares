import {
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';

import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { TimingMiddleware } from './common/middlewares/timing.middleware';

@Module({
  imports: [ProductsModule, UsersModule, CategoriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware, TimingMiddleware).forRoutes('*');
  }
}
