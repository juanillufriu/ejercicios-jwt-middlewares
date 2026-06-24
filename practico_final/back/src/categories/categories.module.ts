import { Module } from '@nestjs/common';
import { CategoriesController } from './controllers/categories.controller';
import { CategoriesService } from './services/categories.service';
import { CategoriesRepository } from './repositories/categories.repository';
import { ProductsRepository } from '../products/repositories/products.repository';

@Module({
 controllers:[CategoriesController],
 providers:[CategoriesService, CategoriesRepository, ProductsRepository],
 exports:[CategoriesService]
})
export class CategoriesModule{}
