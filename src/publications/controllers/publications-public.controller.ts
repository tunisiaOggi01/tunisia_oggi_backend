import { Controller, Get, Post, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { PublicationsReaderService } from '../services/public/publications-reader.service';
import { PublicationsInteractionService } from '../services/public/publications-interaction.service';
import { QueryPublicationsDto } from '../dto/query-publications.dto';

/** Public publication reads + user interactions at /publications. */
@Controller('publications')
export class PublicationsPublicController {
  constructor(
    private reader: PublicationsReaderService,
    private interaction: PublicationsInteractionService,
  ) {}

  @Get()
  findPublished(@Query() query: QueryPublicationsDto) {
    return this.reader.findPublished(query);
  }

  @Get('trending')
  findTrending() {
    return this.reader.findTrending();
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.reader.findBySlug(slug);
  }

  @Get(':slug/related')
  findRelated(@Param('slug') slug: string) {
    return this.reader.findRelated(slug);
  }

  @Post(':id/view')
  @UseGuards(JwtAuthGuard)
  view(@Param('id') id: string, @CurrentUser() user: any) {
    return this.interaction.view(id, user.id);
  }

  @Post(':id/react')
  @UseGuards(JwtAuthGuard)
  react(@Param('id') id: string, @Body('type') type: string, @CurrentUser() user: any) {
    return this.interaction.react(id, user.id, type ?? 'LIKE');
  }

  @Delete(':id/react')
  @UseGuards(JwtAuthGuard)
  unreact(@Param('id') id: string, @CurrentUser() user: any) {
    return this.interaction.unreact(id, user.id);
  }
}
