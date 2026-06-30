import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    findAll(): Promise<import("../entities/category.entity").CategoryEntity[]>;
    findOne(id: number): Promise<import("../entities/category.entity").CategoryEntity>;
    create(dto: CreateCategoryDto): Promise<import("../entities/category.entity").CategoryEntity>;
    update(id: number, dto: UpdateCategoryDto): Promise<import("../entities/category.entity").CategoryEntity>;
    remove(id: number): Promise<import("../entities/category.entity").CategoryEntity>;
}
