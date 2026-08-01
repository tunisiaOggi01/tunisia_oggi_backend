import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { UploadController } from './controllers/upload.controller';
import { UploadService } from './services/upload.service';
import { UploadCleanupService } from './services/upload-cleanup.service';

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule, AuthModule],
  controllers: [UploadController],
  providers: [UploadService, UploadCleanupService],
})
export class UploadModule {}
