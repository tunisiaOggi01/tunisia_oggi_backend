import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { QueryPublicationsDto } from '../../dto/query-publications.dto';

const PUBLIC_INCLUDE = { category: true, author: { select: { id: true, username: true, imageUrl: true } } } as const;

/** Read-only public publication queries: listing, single (with optional auth info), trending, related. */
@Injectable()
export class PublicationsReaderService {
  constructor(private prisma: PrismaService) {}

  async findPublished(query: QueryPublicationsDto) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;
    const where = {
      status: 'PUBLISHED' as const,
      ...(query.categorySlug ? { category: { slug: query.categorySlug } } : {}),
      ...(query.search ? { title: { contains: query.search, mode: 'insensitive' as const } } : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.publication.findMany({
        where, include: PUBLIC_INCLUDE, orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * pageSize, take: pageSize,
      }),
      this.prisma.publication.count({ where }),
    ]);

    return { data, total, page, pageSize };
  }

  async findBySlug(slug: string, userId?: string) {
    const publication = await this.prisma.publication.findFirst({
      where: { slug, status: 'PUBLISHED' },
      include: { ...PUBLIC_INCLUDE, reactions: true },
    });
    if (!publication) throw new NotFoundException('Publication not found');

    const { reactions, ...rest } = publication;
    return {
      ...rest,
      reactionCount: reactions.length,
      userReaction: userId ? reactions.find((r) => r.userId === userId)?.type ?? null : null,
    };
  }

  async findTrending(limit = 5) {
    return this.prisma.publication.findMany({
      where: { status: 'PUBLISHED' }, include: PUBLIC_INCLUDE, orderBy: { rankScore: 'desc' }, take: limit,
    });
  }

  async findRelated(slug: string) {
    const publication = await this.prisma.publication.findFirst({ where: { slug } });
    if (!publication) throw new NotFoundException('Publication not found');

    return this.prisma.publication.findMany({
      where: { status: 'PUBLISHED', categoryId: publication.categoryId, id: { not: publication.id } },
      include: { category: true }, orderBy: { publishedAt: 'desc' }, take: 3,
    });
  }
}
