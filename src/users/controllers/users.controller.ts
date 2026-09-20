import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CsrfGuard } from '../../auth/guards/csrf.guard';
import { CaslGuard } from '../../auth/casl/casl.guard';
import { RequireAbility } from '../../auth/decorators/require-ability.decorator';
import { UsersService } from '../services/users.service';
import { UpdateUserRoleDto } from '../dto/update-user-role.dto';

/** SUPER_ADMIN-only endpoints for managing users. */
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, CaslGuard)
  @RequireAbility('manage', 'User')
  findAll() {
    return this.usersService.findAll();
  }

  @Patch(':id/role')
  @UseGuards(JwtAuthGuard, CsrfGuard, CaslGuard)
  @RequireAbility('manage', 'User')
  updateRole(@Param('id') id: string, @Body() dto: UpdateUserRoleDto) {
    return this.usersService.updateRole(id, dto.role);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard, CsrfGuard, CaslGuard)
  @RequireAbility('manage', 'User')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
