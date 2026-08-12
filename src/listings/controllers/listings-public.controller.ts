import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Throttle, minutes } from '@nestjs/throttler';
import { ListingsPublicService } from '../services/public/listings-public.service';
import { ListingsTrackingService } from '../services/public/listings-tracking.service';
import { QueryListingsDto } from '../dto/query-listings.dto';
import { ClickActionDto } from '../dto/tracking/click-action.dto';

/** Public directory reads at /public/listings — APPROVED entries only, no auth required. */
@Controller('public/listings')
export class ListingsPublicController {
  constructor(
    private listingsPublicService: ListingsPublicService,
    private listingsTrackingService: ListingsTrackingService,
  ) {}

  @Get()
  async findApproved(@Query() query: QueryListingsDto) {
    return this.listingsPublicService.findApproved(query);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.listingsTrackingService.findById(id);
  }

  @Post(':id/click')
  @Throttle({ default: { limit: 10, ttl: minutes(1) } })
  trackClick(@Param('id') id: string, @Body() dto: ClickActionDto) {
    return this.listingsTrackingService.trackClick(id, dto.action);
  }
}
