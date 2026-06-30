import { Repository } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';
import { CategoryEntity } from '../../categories/entities/category.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ListProductsQueryDto } from '../dto/list-products.query';
export declare class ProductsService {
    private readonly productsRepo;
    private readonly categoriesRepo;
    constructor(productsRepo: Repository<ProductEntity>, categoriesRepo: Repository<CategoryEntity>);
    findAll(query: ListProductsQueryDto): Promise<{
        items: ProductEntity[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: number): Promise<ProductEntity>;
    create(dto: CreateProductDto): Promise<ProductEntity>;
    update(id: number, dto: UpdateProductDto): Promise<ProductEntity>;
    remove(id: number): Promise<ProductEntity>;
}
