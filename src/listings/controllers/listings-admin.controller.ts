import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CaslGuard } from '../../auth/casl/casl.guard';
import { CsrfGuard } from '../../auth/guards/csrf.guard';
import { RequireAbility } from '../../auth/decorators/require-ability.decorator';
import { ListingsAdminService } from '../services/admin/listings-admin.service';
import { QueryListingsDto } from '../dto/query-listings.dto';
import { UpdateListingDto } from '../dto/update-listing.dto';

/** Admin-only directory review at /admin/listings — approve/reject/delete with 10-per-page listing. */
@Controller('admin/listings')
@UseGuards(JwtAuthGuard, CaslGuard)
export class ListingsAdminController {
  constructor(private listingsAdminService: ListingsAdminService) {}

  @Get()
  @RequireAbility('read', 'Listing')
  findAll(@Query() query: QueryListingsDto) {
    return this.listingsAdminService.findAll(query);
  }

  @Get('stats')
  @RequireAbility('read', 'Listing')
  stats() {
    return this.listingsAdminService.stats();
  }

  @Patch(':id')
  @UseGuards(CsrfGuard)
  @RequireAbility('update', 'Listing')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateListingDto) {
    return this.listingsAdminService.updateStatus(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(CsrfGuard)
  @RequireAbility('delete', 'Listing')
  remove(@Param('id') id: string) {
    return this.listingsAdminService.remove(id);
  }
}
