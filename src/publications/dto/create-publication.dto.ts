import { IsArray, IsDateString, IsEnum, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { PublicationStatus } from '@prisma/client';

/** Request body for POST /admin/publications. */
export class CreatePublicationDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsUUID()
  categoryId: string;

  @IsString()
  body: string;

  @IsOptional()
  @IsString()
  featuredImageUrl?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsEnum(PublicationStatus)
  status: PublicationStatus;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;
}
