import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CategoriesRepository } from '../repositories/categories.repository';
import { ProductsRepository } from '../../products/repositories/products.repository';

@Injectable()
export class CategoriesService {
 constructor(private readonly categoriesRepository: CategoriesRepository, private readonly productsRepository: ProductsRepository){}
 findAll(){ return this.categoriesRepository.findAll(); }
 findOne(id:number){ const category=this.categoriesRepository.findOne(id); if(!category) throw new NotFoundException('Category not found'); return category; }
 create(name:string){ return this.categoriesRepository.create(name); }
 delete(id:number){ if(this.productsRepository.findByCategory(id).length>0) throw new ConflictException('Category has products'); this.categoriesRepository.delete(id); }
 products(id:number){ return this.productsRepository.findByCategory(id); }
}
