// create-product.dto.ts
import { IsInt, IsNumber, IsOptional, IsPositive, IsString, MaxLength, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MaxLength(256, { message: 'name no puede superar 256 caracteres' })
  name!: string;

  @IsNumber({ maxDecimalPlaces: 4 }, { message: 'price admite hasta 4 decimales' })
  @IsPositive({ message: 'price debe ser mayor a 0' })
  price!: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsInt()
  categoryId?: number | null;
}