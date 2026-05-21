import { IsInt, IsNumber, IsOptional, IsPositive, IsString, Length, Min } from 'class-validator';

export class UpdateProductInput {
 @IsOptional()
 @IsString()
 @Length(2,100)
 name?:string;
 @IsOptional()
 @IsNumber()
 @IsPositive()
 price?:number;
 @IsOptional()
 @IsInt()
 @Min(0)
 stock?:number;
}
