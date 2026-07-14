import { Controller, Get, Param, Query } from '@nestjs/common';
import { PublicationsPublicService } from '../services/publications-public.service';
import { QueryPublicationsDto } from '../dto/query-publications.dto';

/** Public, unauthenticated publication reads at /publications — separate from /admin/publications. */
@Controller('publications')
export class PublicationsPublicController {
  constructor(private publicationsPublicService: PublicationsPublicService) {}

  @Get()
  findPublished(@Query() query: QueryPublicationsDto) {
    return this.publicationsPublicService.findPublished(query);
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.publicationsPublicService.findBySlugAndIncrementViews(slug);
  }

  @Get(':slug/related')
  findRelated(@Param('slug') slug: string) {
    return this.publicationsPublicService.findRelated(slug);
  }
}
