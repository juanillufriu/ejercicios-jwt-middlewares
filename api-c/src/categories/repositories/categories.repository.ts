import { Injectable } from '@nestjs/common';
import { Category } from '../interfaces/category.interface';

@Injectable()
export class CategoriesRepository {
  private categories: Category[] = [
    { id: 1, name: 'Alimentos' },
    { id: 2, name: 'Bebidas' },
  ];

  findAll(): Category[] { return this.categories; }
  findOne(id:number){ return this.categories.find(c=>c.id===id); }
  create(name:string){ const category={id:Date.now(),name}; this.categories.push(category); return category; }
  delete(id:number){ this.categories=this.categories.filter(c=>c.id!==id); }
}
