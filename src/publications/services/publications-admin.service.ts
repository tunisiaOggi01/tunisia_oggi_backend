import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { HtmlSanitizerService } from '../../common/html-sanitizer.service';
import { CreatePublicationDto } from '../dto/create-publication.dto';
import { UpdatePublicationDto } from '../dto/update-publication.dto';
import { QueryPublicationsDto } from '../dto/query-publications.dto';
import { SlugService } from './slug.service';
import { normalizeSearchText } from '../../common/normalize-search';

/** Repository-pattern service for the admin-facing publication CRUD + dashboard stats. */
@Injectable()
export class PublicationsAdminService {
  constructor(
    private prisma: PrismaService,
    private slugService: SlugService,
    private sanitizer: HtmlSanitizerService,
  ) {}

  async create(dto: CreatePublicationDto, authorId: string) {
    const slug = await this.slugService.uniqueSlug(dto.title);
    const publishedAt = dto.status === 'PUBLISHED' ? new Date() : null;
    const rankScore = publishedAt ? 1 / Math.pow(2, 1.5) : 0;
    const cleanTitle = this.sanitizer.sanitize(dto.title);
    const cleanBody = this.sanitizer.sanitize(dto.body);
    const publication = await this.prisma.publication.create({
      data: {
        title: cleanTitle,
        slug,
        body: cleanBody,
        searchText: normalizeSearchText(`${cleanTitle} ${cleanBody}`),
        categoryId: dto.categoryId,
        featuredImageUrl: dto.featuredImageUrl,
        tags: dto.tags ?? [],
        status: dto.status,
        scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
        publishedAt,
        rankScore,
        authorId,
      },
    });

    if (dto.featuredImageUrl) {
      await this.prisma.pendingUpload
        .deleteMany({ where: { url: dto.featuredImageUrl } })
        .catch(() => {});
    }

    return publication;
  }

  async findById(id: string) {
    const publication = await this.prisma.publication.findUnique({
      where: { id },
      include: {
        category: true,
        author: { select: { id: true, username: true } },
      },
    });
    if (!publication) throw new NotFoundException('Publication not found');
    return publication;
  }

  async update(
    id: string,
    dto: UpdatePublicationDto,
    userId: string,
    userRole: Role,
  ) {
    const pub = await this.prisma.publication.findUnique({ where: { id } });
    if (!pub) throw new NotFoundException('Publication not found');
    if (userRole !== Role.SUPER_ADMIN && pub.authorId !== userId)
      throw new ForbiddenException('You can only modify your own publications');

    const data: Record<string, unknown> = { ...dto };
    if (dto.scheduledAt) data.scheduledAt = new Date(dto.scheduledAt);
    if (dto.status === 'PUBLISHED') data.publishedAt = new Date();
    if (typeof data.body === 'string')
      data.body = this.sanitizer.sanitize(data.body);
    if (typeof data.title === 'string')
      data.title = this.sanitizer.sanitize(data.title);
    if (typeof data.title === 'string' && typeof data.body === 'string') {
      data.searchText = normalizeSearchText(`${data.title} ${data.body}`);
    }
    return this.prisma.publication.update({ where: { id }, data });
  }

  async remove(id: string, userId: string, userRole: Role) {
    const pub = await this.prisma.publication.findUnique({ where: { id } });
    if (!pub) throw new NotFoundException('Publication not found');
    if (userRole !== Role.SUPER_ADMIN && pub.authorId !== userId)
      throw new ForbiddenException('You can only modify your own publications');
    await this.prisma.publication.delete({ where: { id } });
  }

  async findAll(query: QueryPublicationsDto) {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;
    const where = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.search
        ? { title: { contains: query.search, mode: 'insensitive' as const } }
        : {}),
      ...(query.authorId ? { authorId: query.authorId } : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.publication.findMany({
        where,
        include: {
          category: true,
          author: { select: { id: true, username: true } },
        },
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

    return {
      totalArticles,
      activeDrafts,
      totalViews: viewsAgg._sum.views ?? 0,
      comments: 0,
    };
  }
}
