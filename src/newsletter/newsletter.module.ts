import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { NewsletterPublicService } from './services/newsletter-public.service';
import { NewsletterAdminService } from './services/newsletter-admin.service';
import { NewsletterPublicController } from './controllers/newsletter-public.controller';
import { NewsletterAdminController } from './controllers/newsletter-admin.controller';

/** Wires the newsletter feature: public signup, admin list/stats/soft-delete/CSV export. */
@Module({
  imports: [AuthModule],
  controllers: [NewsletterPublicController, NewsletterAdminController],
  providers: [NewsletterPublicService, NewsletterAdminService],
})
export class NewsletterModule {}
