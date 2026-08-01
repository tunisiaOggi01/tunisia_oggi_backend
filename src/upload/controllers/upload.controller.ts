import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CaslGuard } from '../../auth/casl/casl.guard';
import { CsrfGuard } from '../../auth/guards/csrf.guard';
import { RequireAbility } from '../../auth/decorators/require-ability.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { UploadService } from '../services/upload.service';

/** Single endpoint accepting a multipart image upload, storing it as pending, returning URL. */
@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('image')
  @UseGuards(JwtAuthGuard, CsrfGuard, CaslGuard)
  @RequireAbility('create', 'Publication')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }))
  async upload(@UploadedFile() file: Express.Multer.File, @CurrentUser() user: any) {
    const url = await this.uploadService.uploadImage(file, user.id);
    return { url };
  }
}
