import { Module } from '@nestjs/common';
import { SeoService } from './services/seo.service';
import { SeoController } from './controllers/seo.controller';

/** Wires the SEO feature: robots.txt and sitemap.xml for crawlers. */
@Module({
  controllers: [SeoController],
  providers: [SeoService],
})
export class SeoModule {}
