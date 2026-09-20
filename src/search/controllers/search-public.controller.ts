import { Controller, Get, Query } from '@nestjs/common';
import { Throttle, minutes } from '@nestjs/throttler';
import { SearchPublicService } from '../services/search-public.service';
import { QuerySearchDto } from '../dto/search.dto';

/** Public combined search: GET /public/search?q= — articles, listings, and category counts. */
@Controller('public/search')
export class SearchPublicController {
  constructor(private searchPublicService: SearchPublicService) {}

  @Get()
  @Throttle({ default: { limit: 20, ttl: minutes(1) } })
  search(@Query() query: QuerySearchDto) {
    return this.searchPublicService.search(query);
  }
}
