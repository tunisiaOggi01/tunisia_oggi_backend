import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CaslGuard } from '../../auth/casl/casl.guard';
import { CsrfGuard } from '../../auth/guards/csrf.guard';
import { RequireAbility } from '../../auth/decorators/require-ability.decorator';
import { NewsletterAdminService } from '../services/newsletter-admin.service';
import { QuerySubscribersDto } from '../dto/newsletter.dto';

/** Admin-only newsletter management at /admin/newsletter — subscribers, stats, soft delete, CSV export. */
@Controller('admin/newsletter')
@UseGuards(JwtAuthGuard, CaslGuard)
export class NewsletterAdminController {
  constructor(private newsletterAdminService: NewsletterAdminService) {}

  @Get('subscribers')
  @RequireAbility('read', 'Newsletter')
  findAll(@Query() query: QuerySubscribersDto) {
    return this.newsletterAdminService.findAll(query);
  }

  @Get('stats')
  @RequireAbility('read', 'Newsletter')
  stats() {
    return this.newsletterAdminService.stats();
  }

  @Delete('subscribers/:id')
  @HttpCode(204)
  @UseGuards(CsrfGuard)
  @RequireAbility('delete', 'Newsletter')
  softDelete(@Param('id') id: string) {
    return this.newsletterAdminService.softDelete(id);
  }

  @Get('export')
  @RequireAbility('read', 'Newsletter')
  async exportCsv(@Res() res: Response) {
    const csv = await this.newsletterAdminService.exportCsv();
    res.set({
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="subscribers.csv"',
    });
    res.send(csv);
  }
}
