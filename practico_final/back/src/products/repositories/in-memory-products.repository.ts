import { Injectable } from '@nestjs/common';
import { Product } from '../product.types';
import { ProductsRepository } from './products.repository';

@Injectable()
export class InMemoryProductsRepository extends ProductsRepository {
  protected products: Product[] = [
    { id: 1, name: 'Yerba', price: 500, stock: 100, categoryId: 1 },
    { id: 2, name: 'Leche', price: 800, stock: 200, categoryId: 1 },
    { id: 3, name: 'Pan', price: 100, stock: 300, categoryId: 2 },
  ];

  override findOne(id: number) {
    return this.products.find((p) => p.id === id);
  }

  override findByCategory(categoryId: number) {
    return this.products.filter((p) => p.categoryId === categoryId);
  }
}
