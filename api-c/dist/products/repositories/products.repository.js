"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsRepository = void 0;
const common_1 = require("@nestjs/common");
let ProductsRepository = class ProductsRepository {
    products = [
        { id: 1, name: 'Yerba', price: 500, stock: 10, categoryId: 1 },
        { id: 2, name: 'Leche', price: 800, stock: 5, categoryId: 1 },
    ];
    findAll() { return this.products; }
    findOne(id) { return this.products.find(p => p.id === id); }
    create(input) {
        const product = { id: Date.now(), ...input };
        this.products.push(product);
        return product;
    }
    findByCategory(categoryId) { return this.products.filter(p => p.categoryId === categoryId); }
};
exports.ProductsRepository = ProductsRepository;
exports.ProductsRepository = ProductsRepository = __decorate([
    (0, common_1.Injectable)()
], ProductsRepository);
//# sourceMappingURL=products.repository.js.map