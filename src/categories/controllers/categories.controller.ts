import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CsrfGuard } from '../../auth/guards/csrf.guard';
import { CaslGuard } from '../../auth/casl/casl.guard';
import { RequireAbility } from '../../auth/decorators/require-ability.decorator';
import { CategoriesService } from '../services/categories.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

/** Public read, SUPER_ADMIN-only writes for the category taxonomy. */
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard, CsrfGuard, CaslGuard)
  @RequireAbility('manage', 'Category')
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, CsrfGuard, CaslGuard)
  @RequireAbility('manage', 'Category')
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard, CsrfGuard, CaslGuard)
  @RequireAbility('manage', 'Category')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
