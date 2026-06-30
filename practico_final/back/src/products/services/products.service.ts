import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';
import { CategoryEntity } from '../../categories/entities/category.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ListProductsQueryDto } from '../dto/list-products.query';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity) private readonly productsRepo: Repository<ProductEntity>,
    @InjectRepository(CategoryEntity) private readonly categoriesRepo: Repository<CategoryEntity>,
  ) {}

  async findAll(query: ListProductsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const sortBy = query.sortBy ?? 'id';
    const order = query.order ?? 'ASC';

    const qb = this.productsRepo.createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');

    if (query.name) qb.andWhere('product.name LIKE :name', { name: `%${query.name}%` });

    qb.orderBy(`product.${sortBy}`, order).skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit };
  }

  async findOne(id: number) {
    const product = await this.productsRepo.findOne({ where: { id }, relations: ['category'] });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async create(dto: CreateProductDto) {
    let categoryId: number | null = null;
    if (dto.categoryId !== undefined && dto.categoryId !== null) {
      const category = await this.categoriesRepo.findOne({ where: { id: dto.categoryId } });
      if (!category) throw new BadRequestException('Category does not exist');
      categoryId = category.id;
    }

    const product = this.productsRepo.create({
      name: dto.name, price: dto.price, stock: dto.stock ?? 0, categoryId,
    });

    const saved = await this.productsRepo.save(product);
    return this.findOne(saved.id);
  }

  async update(id: number, dto: UpdateProductDto) {
    const product = await this.productsRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    if (dto.categoryId !== undefined) {
      if (dto.categoryId === null) {
        product.categoryId = null;
      } else {
        const category = await this.categoriesRepo.findOne({ where: { id: dto.categoryId } });
        if (!category) throw new BadRequestException('Category does not exist');
        product.categoryId = category.id;
      }
    }
    if (dto.name !== undefined) product.name = dto.name;
    if (dto.price !== undefined) product.price = dto.price;
    if (dto.stock !== undefined) product.stock = dto.stock;

    await this.productsRepo.save(product);
    return this.findOne(id);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    await this.productsRepo.delete(id);
    return product;
  }
}