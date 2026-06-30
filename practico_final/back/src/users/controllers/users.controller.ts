import { Body, Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../user-role.enum';
import { AdminUsersService } from '../services/admin-users.service';
import { UpdateUserRoleDto } from '../dto/update-user-role.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class UsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  findAllUsers() {
    return this.adminUsersService.findAll();
  }

  @Patch(':id/role')
  updateRole(
    @Param('id') id: string,
    @Body() dto: UpdateUserRoleDto,
    @Req() req: { user: { id: string } },
  ) {
    return this.adminUsersService.updateRole(id, req.user.id, dto.role);
  }
}