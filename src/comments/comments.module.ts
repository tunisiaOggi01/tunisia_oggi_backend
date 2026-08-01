import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CommentsService } from './services/comments.service';
import { CommentsController } from './controllers/comments.controller';

@Module({
  imports: [AuthModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
