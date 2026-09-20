import {
  Controller,
  Get,
  HttpCode,
  Ip,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { Throttle, minutes } from '@nestjs/throttler';
import { SkipEnvelope } from '../../common/skip-envelope.decorator';
import { AdsPublicService } from '../services/ads-public.service';
import { QueryActiveAdsDto } from '../dto/ads.dto';

/** Public ad endpoints at /public/ads — active-ad lookup per slot, throttled impression/click tracking. */
@Controller('public/ads')
export class AdsPublicController {
  constructor(private adsPublicService: AdsPublicService) {}

  @Get()
  @SkipEnvelope()
  async findActive(@Query() query: QueryActiveAdsDto) {
    return this.adsPublicService.findActive(query);
  }

  @Post(':id/impression')
  @SkipEnvelope()
  @HttpCode(201)
  @Throttle({ default: { limit: 10, ttl: minutes(1) } })
  trackImpression(@Param('id') id: string, @Ip() ip: string) {
    return this.adsPublicService.trackImpression(id, ip);
  }

  @Post(':id/click')
  @SkipEnvelope()
  @HttpCode(201)
  @Throttle({ default: { limit: 10, ttl: minutes(1) } })
  trackClick(@Param('id') id: string, @Ip() ip: string) {
    return this.adsPublicService.trackClick(id, ip);
  }
}
