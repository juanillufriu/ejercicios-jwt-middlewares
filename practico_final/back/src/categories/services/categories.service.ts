import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoriesRepo: Repository<CategoryEntity>,
  ) {}

  findAll() {
    return this.categoriesRepo.find({ order: { name: 'ASC' } });
  }

  async findOne(id: number) {
    const category = await this.categoriesRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async create(name: string) {
    const exists = await this.categoriesRepo.findOne({ where: { name } });
    if (exists) throw new ConflictException('Category name already exists');
    const category = this.categoriesRepo.create({ name });
    return this.categoriesRepo.save(category);
  }

  async update(id: number, name: string) {
    const category = await this.findOne(id);
    if (name !== category.name) {
      const exists = await this.categoriesRepo.findOne({ where: { name } });
      if (exists) throw new ConflictException('Category name already exists');
    }
    category.name = name;
    return this.categoriesRepo.save(category);
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    await this.categoriesRepo.delete(id);
    return category;
  }
}