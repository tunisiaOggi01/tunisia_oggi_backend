import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryPublicationsDto } from '../dto/query-publications.dto';

const PUBLIC_INCLUDE = { category: true, author: { select: { username: true, imageUrl: true } } } as const;

/** Repository-pattern service for read-only public publication access (no auth required). */
@Injectable()
export class PublicationsPublicService {
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
        where,
        include: PUBLIC_INCLUDE,
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.publication.count({ where }),
    ]);

    return { data, total, page, pageSize };
  }

  async findBySlugAndIncrementViews(slug: string) {
    const publication = await this.prisma.publication.findFirst({ where: { slug, status: 'PUBLISHED' } });
    if (!publication) throw new NotFoundException('Publication not found');

    return this.prisma.publication.update({
      where: { id: publication.id },
      data: { views: { increment: 1 } },
      include: PUBLIC_INCLUDE,
    });
  }

  async findRelated(slug: string) {
    const publication = await this.prisma.publication.findFirst({ where: { slug } });
    if (!publication) throw new NotFoundException('Publication not found');

    return this.prisma.publication.findMany({
      where: { status: 'PUBLISHED', categoryId: publication.categoryId, id: { not: publication.id } },
      include: { category: true },
      orderBy: { publishedAt: 'desc' },
      take: 3,
    });
  }
}
