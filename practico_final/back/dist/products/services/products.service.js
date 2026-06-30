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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../entities/product.entity");
const category_entity_1 = require("../../categories/entities/category.entity");
let ProductsService = class ProductsService {
    productsRepo;
    categoriesRepo;
    constructor(productsRepo, categoriesRepo) {
        this.productsRepo = productsRepo;
        this.categoriesRepo = categoriesRepo;
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 10;
        const sortBy = query.sortBy ?? 'id';
        const order = query.order ?? 'ASC';
        const qb = this.productsRepo.createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category');
        if (query.name)
            qb.andWhere('product.name LIKE :name', { name: `%${query.name}%` });
        qb.orderBy(`product.${sortBy}`, order).skip((page - 1) * limit).take(limit);
        const [items, total] = await qb.getManyAndCount();
        return { items, total, page, limit };
    }
    async findOne(id) {
        const product = await this.productsRepo.findOne({ where: { id }, relations: ['category'] });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
    async create(dto) {
        let categoryId = null;
        if (dto.categoryId !== undefined && dto.categoryId !== null) {
            const category = await this.categoriesRepo.findOne({ where: { id: dto.categoryId } });
            if (!category)
                throw new common_1.BadRequestException('Category does not exist');
            categoryId = category.id;
        }
        const product = this.productsRepo.create({
            name: dto.name, price: dto.price, stock: dto.stock ?? 0, categoryId,
        });
        const saved = await this.productsRepo.save(product);
        return this.findOne(saved.id);
    }
    async update(id, dto) {
        const product = await this.productsRepo.findOne({ where: { id } });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        if (dto.categoryId !== undefined) {
            if (dto.categoryId === null) {
                product.categoryId = null;
            }
            else {
                const category = await this.categoriesRepo.findOne({ where: { id: dto.categoryId } });
                if (!category)
                    throw new common_1.BadRequestException('Category does not exist');
                product.categoryId = category.id;
            }
        }
        if (dto.name !== undefined)
            product.name = dto.name;
        if (dto.price !== undefined)
            product.price = dto.price;
        if (dto.stock !== undefined)
            product.stock = dto.stock;
        await this.productsRepo.save(product);
        return this.findOne(id);
    }
    async remove(id) {
        const product = await this.findOne(id);
        await this.productsRepo.delete(id);
        return product;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.ProductEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.CategoryEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map