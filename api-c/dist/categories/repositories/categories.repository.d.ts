import { Category } from '../interfaces/category.interface';
export declare class CategoriesRepository {
    private categories;
    findAll(): Category[];
    findOne(id: number): Category | undefined;
    create(name: string): {
        id: number;
        name: string;
    };
    delete(id: number): void;
}
