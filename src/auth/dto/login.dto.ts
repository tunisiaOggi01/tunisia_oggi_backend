import { IsEmail, IsString, MinLength } from 'class-validator';

/** Request body for POST /auth/login. */
export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
