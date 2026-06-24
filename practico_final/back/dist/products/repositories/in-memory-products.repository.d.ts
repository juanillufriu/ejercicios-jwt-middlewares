import { Product } from '../product.types';
import { ProductsRepository } from './products.repository';
export declare class InMemoryProductsRepository extends ProductsRepository {
    protected products: Product[];
    findOne(id: number): Product | undefined;
    findByCategory(categoryId: number): Product[];
}
