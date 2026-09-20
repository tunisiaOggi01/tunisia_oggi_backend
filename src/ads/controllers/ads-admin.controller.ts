import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CaslGuard } from '../../auth/casl/casl.guard';
import { CsrfGuard } from '../../auth/guards/csrf.guard';
import { RequireAbility } from '../../auth/decorators/require-ability.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { AdsAdminService } from '../services/ads-admin.service';
import {
  CreateAdDto,
  UpdateAdDto,
  QueryAdsDto,
  QueryAdLogsDto,
} from '../dto/ads.dto';

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

  @Get('logs')
  @RequireAbility('read', 'Advertisement')
  findLogs(@Query() query: QueryAdLogsDto) {
    return this.adsAdminService.findLogs(query);
  }

  @Post()
  @UseGuards(CsrfGuard)
  @RequireAbility('create', 'Advertisement')
  create(@Body() dto: CreateAdDto, @CurrentUser() user: any) {
    return this.adsAdminService.create(dto, user);
  }

  @Patch(':id')
  @UseGuards(CsrfGuard)
  @RequireAbility('update', 'Advertisement')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateAdDto,
    @CurrentUser() user: any,
  ) {
    return this.adsAdminService.update(id, dto, user);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(CsrfGuard)
  @RequireAbility('delete', 'Advertisement')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.adsAdminService.remove(id, user);
  }
}
