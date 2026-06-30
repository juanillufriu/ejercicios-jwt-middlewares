import { IsEnum } from 'class-validator';
import { UserRole } from '../user-role.enum';

export class UpdateUserRoleDto {
  @IsEnum(UserRole, { message: 'role debe ser "user" o "admin"' })
  role!: UserRole;
}