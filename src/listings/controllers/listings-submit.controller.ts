import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CsrfGuard } from '../../auth/guards/csrf.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { ListingsPublicService } from '../services/public/listings-public.service';
import { ListingsTrackingService } from '../services/public/listings-tracking.service';
import { CreateListingDto } from '../dto/create-listing.dto';

interface RequestUser {
  id: string;
}

/** Authenticated endpoints at /listings: submission plus the submitter's own listing reads. */
@Controller('listings')
export class ListingsSubmitController {
  constructor(
    private listingsPublicService: ListingsPublicService,
    private listingsTrackingService: ListingsTrackingService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, CsrfGuard)
  submit(@Body() dto: CreateListingDto, @CurrentUser() user: RequestUser) {
    return this.listingsPublicService.submit(dto, user.id);
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  getMine(@CurrentUser() user: RequestUser) {
    return this.listingsTrackingService.getMine(user.id);
  }

  @Get('mine/:id/stats')
  @UseGuards(JwtAuthGuard)
  getMineStats(@Param('id') id: string, @CurrentUser() user: RequestUser) {
    return this.listingsTrackingService.getMineStats(id, user.id);
  }
}
