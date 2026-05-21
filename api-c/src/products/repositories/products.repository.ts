import { Injectable } from '@nestjs/common';
import { Product } from '../product.interface';

@Injectable()
export class ProductsRepository {
  protected products: Product[] = [
    { id: 1, name: 'Yerba', price: 500, stock: 10, categoryId: 1 },
    { id: 2, name: 'Leche', price: 800, stock: 5, categoryId: 1 },
  ];

  findAll(): Product[] { return this.products; }
  findOne(id:number){ return this.products.find(p=>p.id===id); }
  create(input: Omit<Product,'id'>): Product {
   const product={id:Date.now(),...input}; this.products.push(product); return product;
  }
  findByCategory(categoryId:number){ return this.products.filter(p=>p.categoryId===categoryId); }
}
