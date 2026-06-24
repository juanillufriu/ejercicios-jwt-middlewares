import { Module } from '@nestjs/common';
import { ProductsController } from './controllers/products.controller';
import { ProductsService } from './services/products.service';
import { ProductsRepository } from './repositories/products.repository';
import { CategoriesModule } from '../categories/categories.module';

@Module({
 imports:[CategoriesModule],
 controllers:[ProductsController],
 providers:[ProductsService,ProductsRepository],
 exports:[ProductsRepository]
})
export class ProductsModule{}
