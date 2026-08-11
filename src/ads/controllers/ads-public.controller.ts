import { Controller, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import { Throttle, minutes } from '@nestjs/throttler';
import { AdsPublicService } from '../services/ads-public.service';
import { QueryActiveAdsDto } from '../dto/ads.dto';

/** Public ad endpoints at /public/ads — active-ad lookup per slot, throttled impression/click tracking. */
@Controller('public/ads')
export class AdsPublicController {
  constructor(private adsPublicService: AdsPublicService) {}

  @Get()
  async findActive(@Query() query: QueryActiveAdsDto) {
    return { data: await this.adsPublicService.findActive(query) };
  }

  @Post(':id/impression')
  @HttpCode(201)
  @Throttle({ default: { limit: 10, ttl: minutes(1) } })
  trackImpression(@Param('id') id: string) {
    return this.adsPublicService.trackImpression(id);
  }

  @Post(':id/click')
  @HttpCode(201)
  @Throttle({ default: { limit: 10, ttl: minutes(1) } })
  trackClick(@Param('id') id: string) {
    return this.adsPublicService.trackClick(id);
  }
}
