import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateProductInput } from '../dto/create-product.input';
import { ProductsService } from '../services/products.service';

@Controller('products')
export class ProductsController {
 constructor(private readonly productsService:ProductsService){}
 @Get()
 findAll(@Query('page') page=1,@Query('limit') limit=10){
  return this.productsService.findAll(Number(page),Number(limit));
 }
 @Post()
 create(@Body() input:CreateProductInput){
  return this.productsService.create(input);
 }
}
