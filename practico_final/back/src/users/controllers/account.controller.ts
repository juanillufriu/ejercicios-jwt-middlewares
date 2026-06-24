import {
  Body,
  Controller,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

import { AccountService } from '../services/account.service';

import { ChangePasswordDto } from '../dto/change-password.dto';

import { ChangeEmailDto } from '../dto/change-email.dto';

@Controller('users/me')
@UseGuards(JwtAuthGuard)
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Patch('password')
  changePassword(
    @Req() req: { user: { id: string } },
    @Body() dto: ChangePasswordDto,
  ) {
    return this.accountService.changePassword(req.user.id, dto);
  }

  @Patch('email')
  changeEmail(
    @Req() req: { user: { id: string } },
    @Body() dto: ChangeEmailDto,
  ) {
    return this.accountService.changeEmail(req.user.id, dto);
  }
}
