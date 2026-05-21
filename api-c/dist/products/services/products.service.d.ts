import { ProductsRepository } from '../repositories/products.repository';
import { CategoriesService } from '../../categories/services/categories.service';
import { CreateProductInput } from '../dto/create-product.input';
export declare class ProductsService {
    private readonly productsRepository;
    private readonly categoriesService;
    constructor(productsRepository: ProductsRepository, categoriesService: CategoriesService);
    findAll(page?: number, limit?: number): {
        data: import("../product.interface").Product[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    };
    create(input: CreateProductInput): import("../product.interface").Product;
}
