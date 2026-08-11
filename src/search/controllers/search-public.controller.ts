import { Controller, Get, Query } from '@nestjs/common';
import { SearchPublicService } from '../services/search-public.service';
import { QuerySearchDto } from '../dto/search.dto';

/** Public combined search: GET /public/search?q= — articles, listings, and category counts. */
@Controller('public/search')
export class SearchPublicController {
  constructor(private searchPublicService: SearchPublicService) {}

  @Get()
  search(@Query() query: QuerySearchDto) {
    return this.searchPublicService.search(query);
  }
}
