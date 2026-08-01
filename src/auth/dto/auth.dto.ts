import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  username: string;

  @IsString()
  @MinLength(8)
  password: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class HeardAboutDto {
  @IsString()
  source: string;
}
