import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ListingsPublicService } from './services/public/listings-public.service';
import { ListingsTrackingService } from './services/public/listings-tracking.service';
import { ListingsAdminService } from './services/admin/listings-admin.service';
import { ListingsPublicController } from './controllers/listings-public.controller';
import { ListingsSubmitController } from './controllers/listings-submit.controller';
import { ListingsAdminController } from './controllers/listings-admin.controller';

/** Wires the directory feature: public browse/detail + tracking, authenticated submission, admin review. */
@Module({
  imports: [AuthModule],
  controllers: [
    ListingsPublicController,
    ListingsSubmitController,
    ListingsAdminController,
  ],
  providers: [
    ListingsPublicService,
    ListingsTrackingService,
    ListingsAdminService,
  ],
})
export class ListingsModule {}
