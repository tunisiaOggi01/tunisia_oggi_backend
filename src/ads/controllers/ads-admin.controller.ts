import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CaslGuard } from '../../auth/casl/casl.guard';
import { CsrfGuard } from '../../auth/guards/csrf.guard';
import { RequireAbility } from '../../auth/decorators/require-ability.decorator';
import { AdsAdminService } from '../services/ads-admin.service';
import { CreateAdDto, QueryAdsDto } from '../dto/ads.dto';

/** Admin-only ad manager at /admin/ads — create, paginated list with derived status, stats, hard delete. */
@Controller('admin/ads')
@UseGuards(JwtAuthGuard, CaslGuard)
export class AdsAdminController {
  constructor(private adsAdminService: AdsAdminService) {}

  @Get()
  @RequireAbility('read', 'Advertisement')
  findAll(@Query() query: QueryAdsDto) {
    return this.adsAdminService.findAll(query);
  }

  @Get('stats')
  @RequireAbility('read', 'Advertisement')
  stats() {
    return this.adsAdminService.stats();
  }

  @Post()
  @UseGuards(CsrfGuard)
  @RequireAbility('create', 'Advertisement')
  create(@Body() dto: CreateAdDto) {
    return this.adsAdminService.create(dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(CsrfGuard)
  @RequireAbility('delete', 'Advertisement')
  remove(@Param('id') id: string) {
    return this.adsAdminService.remove(id);
  }
}
