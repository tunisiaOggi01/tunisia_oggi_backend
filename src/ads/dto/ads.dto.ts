import {
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AdPlacement } from '@prisma/client';

/** Request body for POST /admin/ads — advertiser details optional, dates required. */
export class CreateAdDto {
  @IsString()
  @MaxLength(120)
  title: string;

  @IsUrl()
  imageUrl: string;

  @IsUrl()
  linkUrl: string;

  @IsEnum(AdPlacement)
  placement: AdPlacement;

  @IsOptional()
  @IsString()
  advertiserName?: string;

  @IsOptional()
  @IsEmail()
  advertiserEmail?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  maxImpressions?: number;

  @IsString()
  startDate: string;

  @IsString()
  endDate: string;
}

/** Request body for PATCH /admin/ads/:id — all fields optional for partial update. */
export class UpdateAdDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  title?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsUrl()
  linkUrl?: string;

  @IsOptional()
  @IsEnum(AdPlacement)
  placement?: AdPlacement;

  @IsOptional()
  @IsString()
  advertiserName?: string;

  @IsOptional()
  @IsEmail()
  advertiserEmail?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  maxImpressions?: number;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}

/** Query params for the admin ads list — optional placement filter, 10 per page. */
export class QueryAdsDto {
  @IsOptional()
  @IsEnum(AdPlacement)
  placement?: AdPlacement;

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

/** Query params for the public ad lookup — placement required, cap of 3 for HOME_STRIP. */
export class QueryActiveAdsDto {
  @IsEnum(AdPlacement)
  placement: AdPlacement;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(3)
  limit?: number = 1;
}

/** Query params for the admin ad logs list — pagination only. */
export class QueryAdLogsDto {
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
  pageSize?: number = 20;
}
