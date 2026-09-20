import { IsEmail, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

/** Request body for POST /public/newsletter/subscribe. */
export class SubscribeNewsletterDto {
  @IsEmail()
  email: string;
}

/** Query params for GET /admin/newsletter/subscribers — 10 per page. */
export class QuerySubscribersDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 10;
}
