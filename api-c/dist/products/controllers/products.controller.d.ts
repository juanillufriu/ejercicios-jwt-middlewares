import { CreateProductInput } from '../dto/create-product.input';
import { ProductsService } from '../services/products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
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
