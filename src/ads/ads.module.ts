import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AdsPublicService } from './services/ads-public.service';
import { AdsAdminService } from './services/ads-admin.service';
import { AdsPublicController } from './controllers/ads-public.controller';
import { AdsAdminController } from './controllers/ads-admin.controller';

/** Wires the sponsored-ads feature: public active lookup + tracking, SUPER_ADMIN manager, no cron. */
@Module({
  imports: [AuthModule],
  controllers: [AdsPublicController, AdsAdminController],
  providers: [AdsPublicService, AdsAdminService],
})
export class AdsModule {}
