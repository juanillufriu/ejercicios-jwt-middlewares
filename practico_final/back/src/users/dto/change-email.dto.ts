import { IsEmail, IsString, MinLength } from 'class-validator';

export class ChangeEmailDto {
  @IsEmail({}, { message: 'Email inválido' })
  newEmail!: string;

  @IsString()
  @MinLength(1, { message: 'Contraseña actual requerida' })
  currentPassword!: string;
}
