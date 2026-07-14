import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { CsrfGuard } from '../../auth/guards/csrf.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { PublicationsAdminService } from '../services/publications-admin.service';
import { CreatePublicationDto } from '../dto/create-publication.dto';
import { UpdatePublicationDto } from '../dto/update-publication.dto';
import { QueryPublicationsDto } from '../dto/query-publications.dto';

/**
 * Admin-only publication management, mounted at /admin/publications — a separate prefix from the
 * public /publications routes (Task 6) so there is no literal-vs-param route ambiguity to resolve.
 */
@Controller('admin/publications')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.SUPER_ADMIN, Role.EDITOR)
export class PublicationsAdminController {
  constructor(private publicationsAdminService: PublicationsAdminService) {}

  @Post()
  @UseGuards(CsrfGuard)
  create(@Body() dto: CreatePublicationDto, @CurrentUser() user: any) {
    return this.publicationsAdminService.create(dto, user.id);
  }

  @Patch(':id')
  @UseGuards(CsrfGuard)
  update(@Param('id') id: string, @Body() dto: UpdatePublicationDto) {
    return this.publicationsAdminService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(CsrfGuard)
  remove(@Param('id') id: string) {
    return this.publicationsAdminService.remove(id);
  }

  @Get()
  findAll(@Query() query: QueryPublicationsDto) {
    return this.publicationsAdminService.findAll(query);
  }

  @Get('stats')
  stats() {
    return this.publicationsAdminService.stats();
  }
}
