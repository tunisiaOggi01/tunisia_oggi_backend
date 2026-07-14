import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PublicationsAdminService } from './services/publications-admin.service';
import { PublicationsPublicService } from './services/publications-public.service';
import { SlugService } from './services/slug.service';
import { PublicationsAdminController } from './controllers/publications-admin.controller';
import { PublicationsPublicController } from './controllers/publications-public.controller';

@Module({
  imports: [AuthModule],
  controllers: [PublicationsAdminController, PublicationsPublicController],
  providers: [PublicationsAdminService, PublicationsPublicService, SlugService],
})
export class PublicationsModule {}
