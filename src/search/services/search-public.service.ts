import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { QuerySearchDto } from '../dto/search.dto';
import { normalizeSearchText } from '../../common/normalize-search';

const AUTHOR_SELECT = { select: { id: true, username: true, imageUrl: true } };

/** Repository-pattern service for combined public search: articles + approved listings + category counts. */
@Injectable()
export class SearchPublicService {
  constructor(private prisma: PrismaService) {}

  async search(query: QuerySearchDto) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 9;
    const q = normalizeSearchText(query.q);
    const textMatch = q
      ? { searchText: { contains: q, mode: 'insensitive' as const } }
      : {};
    const publishedWhere = { status: 'PUBLISHED' as const, ...textMatch };

    const [articles, totalArticles, listings, categoryGroup] =
      await Promise.all([
        this.prisma.publication.findMany({
          where: publishedWhere,
          include: { category: true, author: AUTHOR_SELECT },
          orderBy: { publishedAt: 'desc' },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        this.prisma.publication.count({ where: publishedWhere }),
        this.prisma.businessListing.findMany({
          where: { status: 'APPROVED', ...textMatch },
          take: 5,
        }),
        this.prisma.publication.groupBy({
          by: ['categoryId'],
          where: publishedWhere,
          _count: { _all: true },
        }),
      ]);

    const categories = await this.prisma.category.findMany({
      where: { id: { in: categoryGroup.map((g) => g.categoryId) } },
      select: { id: true, name: true, slug: true },
    });
    const byId = new Map(categories.map((c) => [c.id, c]));
    const categoryCounts = categoryGroup
      .map((g) => ({ ...byId.get(g.categoryId), count: g._count._all }))
      .filter((c) => c.name)
      .sort((a, b) => b.count - a.count);

    return {
      articles,
      totalArticles,
      page,
      pageSize,
      listings,
      categoryCounts,
    };
  }
}
