import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';

/** Request body for PATCH /categories/:id — every field of CreateCategoryDto, made optional. */
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
