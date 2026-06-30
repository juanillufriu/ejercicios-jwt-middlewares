import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ListProductsQueryDto } from '../dto/list-products.query';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(query: ListProductsQueryDto): Promise<{
        items: import("../entities/product.entity").ProductEntity[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: number): Promise<import("../entities/product.entity").ProductEntity>;
    create(dto: CreateProductDto): Promise<import("../entities/product.entity").ProductEntity>;
    update(id: number, dto: UpdateProductDto): Promise<import("../entities/product.entity").ProductEntity>;
    remove(id: number): Promise<import("../entities/product.entity").ProductEntity>;
}
