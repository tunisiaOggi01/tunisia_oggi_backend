import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CaslGuard } from '../../auth/casl/casl.guard';
import { CsrfGuard } from '../../auth/guards/csrf.guard';
import { RequireAbility } from '../../auth/decorators/require-ability.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { PublicationsAdminService } from '../services/publications-admin.service';
import { CreatePublicationDto } from '../dto/create-publication.dto';
import { UpdatePublicationDto } from '../dto/update-publication.dto';
import { QueryPublicationsDto } from '../dto/query-publications.dto';

/**
 * Admin-only publication management at /admin/publications — a separate prefix from the
 * public /publications routes so there is no literal-vs-param route ambiguity to resolve.
 */
@Controller('admin/publications')
@UseGuards(JwtAuthGuard, CaslGuard)
export class PublicationsAdminController {
  constructor(private publicationsAdminService: PublicationsAdminService) {}

  @Post()
  @UseGuards(CsrfGuard)
  @RequireAbility('create', 'Publication')
  create(@Body() dto: CreatePublicationDto, @CurrentUser() user: any) {
    return this.publicationsAdminService.create(dto, user.id);
  }

  @Get(':id')
  @RequireAbility('read', 'Publication')
  findById(@Param('id') id: string) {
    return this.publicationsAdminService.findById(id);
  }

  @Patch(':id')
  @UseGuards(CsrfGuard)
  @RequireAbility('update', 'Publication')
  update(@Param('id') id: string, @Body() dto: UpdatePublicationDto, @CurrentUser() user: any) {
    return this.publicationsAdminService.update(id, dto, user.id, user.role);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(CsrfGuard)
  @RequireAbility('delete', 'Publication')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.publicationsAdminService.remove(id, user.id, user.role);
  }

  @Get()
  @RequireAbility('read', 'Publication')
  findAll(@Query() query: QueryPublicationsDto) {
    return this.publicationsAdminService.findAll(query);
  }

  @Get('stats')
  @RequireAbility('read', 'Publication')
  stats() {
    return this.publicationsAdminService.stats();
  }
}
