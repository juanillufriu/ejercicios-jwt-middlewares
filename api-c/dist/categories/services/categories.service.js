"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const categories_repository_1 = require("../repositories/categories.repository");
const products_repository_1 = require("../../products/repositories/products.repository");
let CategoriesService = class CategoriesService {
    categoriesRepository;
    productsRepository;
    constructor(categoriesRepository, productsRepository) {
        this.categoriesRepository = categoriesRepository;
        this.productsRepository = productsRepository;
    }
    findAll() { return this.categoriesRepository.findAll(); }
    findOne(id) { const category = this.categoriesRepository.findOne(id); if (!category)
        throw new common_1.NotFoundException('Category not found'); return category; }
    create(name) { return this.categoriesRepository.create(name); }
    delete(id) { if (this.productsRepository.findByCategory(id).length > 0)
        throw new common_1.ConflictException('Category has products'); this.categoriesRepository.delete(id); }
    products(id) { return this.productsRepository.findByCategory(id); }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [categories_repository_1.CategoriesRepository, products_repository_1.ProductsRepository])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map