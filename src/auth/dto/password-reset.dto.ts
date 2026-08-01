import { IsEmail, IsString, MinLength } from 'class-validator';

/** Request body for POST /auth/forgot-password. */
export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}

/** Request body for POST /auth/reset-password. */
export class ResetPasswordDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  otpCode: string;

  @IsString()
  @MinLength(8)
  newPassword: string;
}
