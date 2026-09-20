import {
  IsHexColor,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

/** Request body for POST /categories. */
export class CreateCategoryDto {
  @IsString()
  @MaxLength(50)
  name: string;

  @IsString()
  @Matches(/^[a-z0-9-]+$/)
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsHexColor()
  color?: string;
}
