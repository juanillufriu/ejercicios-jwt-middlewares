import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductsRepository } from '../repositories/products.repository';
import { CategoriesService } from '../../categories/services/categories.service';
import { CreateProductInput } from '../dto/create-product.input';

@Injectable()
export class ProductsService {
 constructor(private readonly productsRepository:ProductsRepository, private readonly categoriesService:CategoriesService){}
 findAll(page=1,limit=10){
  limit=Math.min(limit,50); page=Math.max(page,1);
  const data=this.productsRepository.findAll();
  const start=(page-1)*limit;
  return {
   data:data.slice(start,start+limit),
   meta:{page,limit,total:data.length,totalPages:Math.ceil(data.length/limit)}
  };
 }
 create(input:CreateProductInput){
  const category=this.categoriesService.findOne(input.categoryId);
  if(!category) throw new BadRequestException('Category does not exist');
  return this.productsRepository.create(input);
 }
}
