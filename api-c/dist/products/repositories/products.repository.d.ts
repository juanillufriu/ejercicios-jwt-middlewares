import { Product } from '../product.interface';
export declare class ProductsRepository {
    protected products: Product[];
    findAll(): Product[];
    findOne(id: number): Product | undefined;
    create(input: Omit<Product, 'id'>): Product;
    findByCategory(categoryId: number): Product[];
}
