import { CategoryEntity } from '../../categories/entities/category.entity';
export declare class ProductEntity {
    id: number;
    name: string;
    price: number;
    stock: number;
    categoryId: number | null;
    category: CategoryEntity | null;
}
