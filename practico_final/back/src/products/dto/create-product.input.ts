import { IsInt, IsNumber, IsPositive, IsString, Length, Min } from 'class-validator';

export class CreateProductInput {
 @IsString()
 @Length(2,100)
 name:string;
 @IsNumber()
 @IsPositive()
 price:number;
 @IsInt()
 @Min(0)
 stock:number;
 @IsInt()
 categoryId:number;
}
