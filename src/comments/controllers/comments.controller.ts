import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CsrfGuard } from '../../auth/guards/csrf.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { CommentsService } from '../services/comments.service';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';

@Controller()
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get('publications/:id/comments')
  findByPublication(@Param('id') id: string) {
    return this.commentsService.findByPublication(id);
  }

  @Post('publications/:id/comments')
  @UseGuards(JwtAuthGuard, CsrfGuard)
  @HttpCode(201)
  create(@Param('id') id: string, @Body() dto: CreateCommentDto, @CurrentUser() user: any) {
    return this.commentsService.create(dto.body, id, user.id, dto.parentId);
  }

  @Patch('comments/:id')
  @UseGuards(JwtAuthGuard, CsrfGuard)
  update(@Param('id') id: string, @Body() dto: UpdateCommentDto, @CurrentUser() user: any) {
    return this.commentsService.update(id, dto, user.id, user.role);
  }

  @Delete('comments/:id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard, CsrfGuard)
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.commentsService.remove(id, user.id, user.role);
  }
}
