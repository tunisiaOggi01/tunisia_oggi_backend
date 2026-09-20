import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

/** User interaction service: unique view counting, one-reaction-per-user. */
@Injectable()
export class PublicationsInteractionService {
  constructor(private prisma: PrismaService) {}

  async view(id: string, userId: string) {
    const pub = await this.prisma.publication.findUnique({ where: { id } });
    if (!pub) throw new NotFoundException('Publication not found');

    const existing = await this.prisma.publicationView.findUnique({
      where: { userId_publicationId: { userId, publicationId: id } },
    });
    if (existing) return { viewed: false };

    await this.prisma.publicationView.create({
      data: { userId, publicationId: id },
    });

    const ageInHours =
      (Date.now() - new Date(pub.publishedAt ?? pub.createdAt).getTime()) /
      3_600_000;
    const views = pub.views + 1;
    const rankScore = views / Math.pow(Math.max(ageInHours, 0) + 2, 1.5);

    await this.prisma.publication.update({
      where: { id },
      data: { views, rankScore },
    });
    return { viewed: true, views, rankScore };
  }

  async react(id: string, userId: string, type: string) {
    const pub = await this.prisma.publication.findUnique({ where: { id } });
    if (!pub) throw new NotFoundException('Publication not found');

    const existing = await this.prisma.publicationReaction.findUnique({
      where: { userId_publicationId: { userId, publicationId: id } },
    });

    if (existing) {
      if (existing.type === type)
        return { reacted: false, type: existing.type };
      await this.prisma.publicationReaction.update({
        where: { id: existing.id },
        data: { type },
      });
    } else {
      await this.prisma.publicationReaction.create({
        data: { userId, publicationId: id, type },
      });
      await this.prisma.publication.update({
        where: { id },
        data: { likes: { increment: 1 } },
      });
    }

    const count = await this.prisma.publicationReaction.count({
      where: { publicationId: id },
    });
    return { reacted: true, type, reactionCount: count };
  }

  async findMyReactions(userId: string) {
    return this.prisma.publicationReaction.findMany({
      where: { userId },
      include: {
        publication: {
          include: {
            category: {
              select: { id: true, name: true, slug: true, color: true },
            },
            author: { select: { id: true, username: true, imageUrl: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async unreact(id: string, userId: string) {
    const existing = await this.prisma.publicationReaction.findUnique({
      where: { userId_publicationId: { userId, publicationId: id } },
    });
    if (!existing) return { unreacted: false };

    await this.prisma.publicationReaction.delete({
      where: { id: existing.id },
    });
    await this.prisma.publication.update({
      where: { id },
      data: { likes: { decrement: 1 } },
    });

    const count = await this.prisma.publicationReaction.count({
      where: { publicationId: id },
    });
    return { unreacted: true, reactionCount: count };
  }
}
