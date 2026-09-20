import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateCommentDto } from '../dto/update-comment.dto';

const COMMENT_INCLUDE = {
  user: { select: { id: true, username: true, imageUrl: true } },
} as const;

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async findByPublication(publicationId: string) {
    const comments = await this.prisma.comment.findMany({
      where: { publicationId, parentId: null },
      include: {
        ...COMMENT_INCLUDE,
        replies: { include: COMMENT_INCLUDE, orderBy: { createdAt: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return comments;
  }

  async create(
    body: string,
    publicationId: string,
    userId: string,
    parentId?: string,
  ) {
    const pub = await this.prisma.publication.findUnique({
      where: { id: publicationId },
    });
    if (!pub) throw new NotFoundException('Publication not found');

    if (parentId) {
      const parent = await this.prisma.comment.findUnique({
        where: { id: parentId },
      });
      if (!parent || parent.publicationId !== publicationId)
        throw new NotFoundException('Parent comment not found');
    }

    return this.prisma.comment.create({
      data: { body, userId, publicationId, parentId: parentId ?? null },
      include: COMMENT_INCLUDE,
    });
  }

  async update(id: string, dto: UpdateCommentDto, userId: string, role: Role) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException('Comment not found');
    if (role !== Role.SUPER_ADMIN && comment.userId !== userId)
      throw new ForbiddenException('Cannot edit others comments');

    return this.prisma.comment.update({
      where: { id },
      data: { body: dto.body },
      include: COMMENT_INCLUDE,
    });
  }

  async remove(id: string, userId: string, role: Role) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });
    if (!comment) throw new NotFoundException('Comment not found');
    if (role !== Role.SUPER_ADMIN && comment.userId !== userId)
      throw new ForbiddenException('Cannot delete others comments');

    await this.prisma.comment.deleteMany({
      where: { OR: [{ id }, { parentId: id }] },
    });
  }
}
