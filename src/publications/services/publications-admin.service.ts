import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePublicationDto } from '../dto/create-publication.dto';
import { UpdatePublicationDto } from '../dto/update-publication.dto';
import { QueryPublicationsDto } from '../dto/query-publications.dto';
import { SlugService } from './slug.service';

/** Repository-pattern service for the admin-facing publication CRUD + dashboard stats. */
@Injectable()
export class PublicationsAdminService {
  constructor(private prisma: PrismaService, private slugService: SlugService) {}

  async create(dto: CreatePublicationDto, authorId: string) {
    const slug = await this.slugService.uniqueSlug(dto.title);
    return this.prisma.publication.create({
      data: {
        title: dto.title,
        slug,
        body: dto.body,
        categoryId: dto.categoryId,
        featuredImageUrl: dto.featuredImageUrl,
        tags: dto.tags ?? [],
        status: dto.status,
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
        publishedAt: dto.status === 'PUBLISHED' ? new Date() : null,
        authorId,
      },
    });
  }

  async update(id: string, dto: UpdatePublicationDto) {
    await this.ensureExists(id);
    const data: Record<string, unknown> = { ...dto };
    if (dto.scheduledAt) data.scheduledAt = new Date(dto.scheduledAt);
    if (dto.status === 'PUBLISHED') data.publishedAt = new Date();
    return this.prisma.publication.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.publication.delete({ where: { id } });
  }

  async findAll(query: QueryPublicationsDto) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;
    const where = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.search ? { title: { contains: query.search, mode: 'insensitive' as const } } : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.publication.findMany({
        where,
        include: { category: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.publication.count({ where }),
    ]);

    return { data, total, page, pageSize };
  }

  async stats() {
    const [totalArticles, activeDrafts, viewsAgg] = await Promise.all([
      this.prisma.publication.count(),
      this.prisma.publication.count({ where: { status: 'DRAFT' } }),
      this.prisma.publication.aggregate({ _sum: { views: true } }),
    ]);

    return { totalArticles, activeDrafts, totalViews: viewsAgg._sum.views ?? 0, comments: 0 };
  }

  private async ensureExists(id: string) {
    const found = await this.prisma.publication.findUnique({ where: { id } });
    if (!found) throw new NotFoundException('Publication not found');
  }
}
