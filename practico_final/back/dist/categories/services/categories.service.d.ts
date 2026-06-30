import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
export declare class CategoriesService {
    private readonly categoriesRepo;
    constructor(categoriesRepo: Repository<CategoryEntity>);
    findAll(): Promise<CategoryEntity[]>;
    findOne(id: number): Promise<CategoryEntity>;
    create(name: string): Promise<CategoryEntity>;
    update(id: number, name: string): Promise<CategoryEntity>;
    remove(id: number): Promise<CategoryEntity>;
}
