import { Body, Controller, HttpCode, Patch, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CsrfGuard } from '../guards/csrf.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import {
  ChangeUsernameDto,
  ChangeEmailDto,
  ChangePasswordDto,
} from '../dto/settings.dto';

/** Settings endpoints at /auth/settings — username, email, password changes. */
@Controller('auth/settings')
export class SettingsController {
  constructor(private authService: AuthService) {}

  @Patch('username')
  @UseGuards(JwtAuthGuard, CsrfGuard)
  @HttpCode(200)
  async changeUsername(
    @CurrentUser() user: any,
    @Body() dto: ChangeUsernameDto,
  ) {
    return this.authService.changeUsername(user.id, dto.username);
  }

  @Patch('email')
  @UseGuards(JwtAuthGuard, CsrfGuard)
  @HttpCode(200)
  async changeEmail(@CurrentUser() user: any, @Body() dto: ChangeEmailDto) {
    return this.authService.changeEmail(user.id, dto.email);
  }

  @Patch('password')
  @UseGuards(JwtAuthGuard, CsrfGuard)
  @HttpCode(200)
  async changePassword(
    @CurrentUser() user: any,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(
      user.id,
      dto.currentPassword,
      dto.newPassword,
    );
  }
}
