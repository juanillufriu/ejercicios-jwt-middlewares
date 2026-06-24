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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const products_repository_1 = require("../repositories/products.repository");
const categories_service_1 = require("../../categories/services/categories.service");
let ProductsService = class ProductsService {
    productsRepository;
    categoriesService;
    constructor(productsRepository, categoriesService) {
        this.productsRepository = productsRepository;
        this.categoriesService = categoriesService;
    }
    findAll(page = 1, limit = 10) {
        limit = Math.min(limit, 50);
        page = Math.max(page, 1);
        const data = this.productsRepository.findAll();
        const start = (page - 1) * limit;
        return {
            data: data.slice(start, start + limit),
            meta: { page, limit, total: data.length, totalPages: Math.ceil(data.length / limit) }
        };
    }
    create(input) {
        const category = this.categoriesService.findOne(input.categoryId);
        if (!category)
            throw new common_1.BadRequestException('Category does not exist');
        return this.productsRepository.create(input);
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [products_repository_1.ProductsRepository, categories_service_1.CategoriesService])
], ProductsService);
//# sourceMappingURL=products.service.js.map