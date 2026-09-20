import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { HtmlSanitizerService } from '../common/html-sanitizer.service';
import { PublicationsAdminService } from './services/publications-admin.service';
import { PublicationsReaderService } from './services/public/publications-reader.service';
import { PublicationsInteractionService } from './services/public/publications-interaction.service';
import { SlugService } from './services/slug.service';
import { PublicationsAdminController } from './controllers/publications-admin.controller';
import { PublicationsPublicController } from './controllers/publications-public.controller';

@Module({
  imports: [AuthModule],
  controllers: [PublicationsAdminController, PublicationsPublicController],
  providers: [
    PublicationsAdminService,
    PublicationsReaderService,
    PublicationsInteractionService,
    SlugService,
    HtmlSanitizerService,
  ],
})
export class PublicationsModule {}
