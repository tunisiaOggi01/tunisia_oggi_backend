import { Controller, Get, Header } from '@nestjs/common';
import { SeoService } from '../services/seo.service';
import { SkipEnvelope } from '../../common/skip-envelope.decorator';

/** SEO endpoints at /seo — robots.txt and the XML sitemap, both plain text/xml. */
@Controller('seo')
export class SeoController {
  constructor(private seoService: SeoService) {}

  @Get('robots.txt')
  @Header('Content-Type', 'text/plain; charset=utf-8')
  @SkipEnvelope()
  robots() {
    return this.seoService.robots();
  }

  @Get('sitemap.xml')
  @Header('Content-Type', 'application/xml; charset=utf-8')
  @SkipEnvelope()
  sitemap() {
    return this.seoService.sitemap();
  }
}
