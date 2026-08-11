import { Module } from '@nestjs/common';
import { SearchPublicService } from './services/search-public.service';
import { SearchPublicController } from './controllers/search-public.controller';

/** Wires the combined public search endpoint (articles + directory + category counts). */
@Module({
  controllers: [SearchPublicController],
  providers: [SearchPublicService],
})
export class SearchModule {}
