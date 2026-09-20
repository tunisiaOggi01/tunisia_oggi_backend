import { IsEnum, IsOptional, IsString, IsInt, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PublicationStatus } from '@prisma/client';

/** Shared query params for both the admin and public publication listings. */
export class QueryPublicationsDto {
  @IsOptional()
  @IsEnum(PublicationStatus)
  status?: PublicationStatus;

  @IsOptional()
  @IsString()
  categorySlug?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsString()
  authorId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 10;
}
