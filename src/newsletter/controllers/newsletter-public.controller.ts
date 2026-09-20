import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Throttle, minutes } from '@nestjs/throttler';
import { NewsletterPublicService } from '../services/newsletter-public.service';
import { SubscribeNewsletterDto } from '../dto/newsletter.dto';

/** Public newsletter endpoint: POST /public/newsletter/subscribe (open, no auth, 409 on duplicates). */
@Controller('public/newsletter')
export class NewsletterPublicController {
  constructor(private newsletterPublicService: NewsletterPublicService) {}

  @Post('subscribe')
  @HttpCode(201)
  @Throttle({ default: { limit: 5, ttl: minutes(1) } })
  subscribe(@Body() dto: SubscribeNewsletterDto) {
    return this.newsletterPublicService.subscribe(dto);
  }
}
