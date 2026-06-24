import { CategoriesRepository } from '../repositories/categories.repository';
import { ProductsRepository } from '../../products/repositories/products.repository';
export declare class CategoriesService {
    private readonly categoriesRepository;
    private readonly productsRepository;
    constructor(categoriesRepository: CategoriesRepository, productsRepository: ProductsRepository);
    findAll(): import("../interfaces/category.interface").Category[];
    findOne(id: number): import("../interfaces/category.interface").Category;
    create(name: string): {
        id: number;
        name: string;
    };
    delete(id: number): void;
    products(id: number): import("../../products/product.interface").Product[];
}
