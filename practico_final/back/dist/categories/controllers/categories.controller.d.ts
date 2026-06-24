import { CategoriesService } from '../services/categories.service';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): import("../interfaces/category.interface").Category[];
    findOne(id: number): import("../interfaces/category.interface").Category;
    products(id: number): import("../../products/product.interface").Product[];
    create(name: string): {
        id: number;
        name: string;
    };
    delete(id: number): void;
}
