import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

/** Request body for PATCH /auth/settings/username — 3-30 chars. */
export class ChangeUsernameDto {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  username: string;
}

/** Request body for PATCH /auth/settings/email — valid email required. */
export class ChangeEmailDto {
  @IsEmail()
  email: string;
}

/** Request body for PATCH /auth/settings/password — current + new password. */
export class ChangePasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  @MinLength(8)
  newPassword: string;
}
