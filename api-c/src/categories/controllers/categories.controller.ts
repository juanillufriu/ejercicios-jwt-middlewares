import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';

@Controller('categories')
export class CategoriesController {
 constructor(private readonly categoriesService: CategoriesService){}
 @Get() findAll(){ return this.categoriesService.findAll(); }
 @Get(':id') findOne(@Param('id',ParseIntPipe) id:number){ return this.categoriesService.findOne(id); }
 @Get(':id/products') products(@Param('id',ParseIntPipe) id:number){ return this.categoriesService.products(id); }
 @Post() create(@Body('name') name:string){ return this.categoriesService.create(name); }
 @Delete(':id') delete(@Param('id',ParseIntPipe) id:number){ return this.categoriesService.delete(id); }
}
