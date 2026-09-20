import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Post,
  Res,
  UseGuards,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Throttle, minutes } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { RefreshTokenService } from '../services/refresh-token.service';
import {
  LoginDto,
  RegisterDto,
  UpdateProfileDto,
  HeardAboutDto,
} from '../dto/auth.dto';
import { ForgotPasswordDto, ResetPasswordDto } from '../dto/password-reset.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CsrfGuard } from '../guards/csrf.guard';
import { RefreshThrottleGuard } from '../guards/refresh-throttle.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private refreshTokenService: RefreshTokenService,
  ) {}

  private setCookies(res: Response, token: string, refreshToken: string) {
    const secure = process.env.NODE_ENV === 'production';
    res.cookie('access_token', token, {
      httpOnly: true,
      secure,
      sameSite: secure ? 'none' : 'lax',
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure,
      sameSite: secure ? 'none' : 'lax',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }

  @Post('login')
  @HttpCode(200)
  @Throttle({ default: { limit: 10, ttl: minutes(1) } })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.validateAndLogin(
      dto.email,
      dto.password,
    );
    this.setCookies(res, result.token, result.refreshToken);
    return { user: result.user, csrfToken: result.csrfToken };
  }

  @Post('register')
  @HttpCode(201)
  @Throttle({ default: { limit: 5, ttl: minutes(1) } })
  async register(@Body() dto: RegisterDto) {
    const result = await this.authService.register(
      dto.email,
      dto.username,
      dto.password,
    );
    return { user: result.user };
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async updateProfile(@CurrentUser() user: any, @Body() dto: UpdateProfileDto) {
    return this.authService.updateProfile(user.id, dto);
  }

  @Patch('heard-about')
  @UseGuards(JwtAuthGuard, CsrfGuard)
  @HttpCode(200)
  async updateHeardAbout(@CurrentUser() user: any, @Body() dto: HeardAboutDto) {
    return this.authService.updateHeardAbout(user.id, dto.source);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async me(@CurrentUser() user: any, @Req() req: Request) {
    const profile = await this.authService.getProfile(user.id);
    return { user: profile, csrfToken: (req as any).csrfClaim };
  }

  @Post('forgot-password')
  @HttpCode(200)
  @Throttle({ default: { limit: 3, ttl: minutes(5) } })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  @HttpCode(200)
  @Throttle({ default: { limit: 5, ttl: minutes(1) } })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.authService.resetPassword(
      dto.email,
      dto.otpCode,
      dto.newPassword,
    );
    return { message: 'Password has been reset successfully.' };
  }

  @Post('refresh')
  @UseGuards(RefreshThrottleGuard)
  @HttpCode(200)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const raw = req.cookies?.refresh_token;
    if (!raw) throw new UnauthorizedException('No refresh token');
    const { accessToken, csrfToken, newRefreshToken } =
      await this.refreshTokenService.rotate(raw);
    this.setCookies(res, accessToken, newRefreshToken);
    return { csrfToken };
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const raw = req.cookies?.refresh_token;
    if (raw) await this.refreshTokenService.revoke(raw);
    res.clearCookie('access_token');
    res.clearCookie('refresh_token', { path: '/auth/refresh' });
    return { success: true };
  }
}
