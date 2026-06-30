import { IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @Length(1, 128, { message: 'name debe tener entre 1 y 128 caracteres' })
  name!: string;
}