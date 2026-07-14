import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/** Turns a title into a URL slug and guarantees uniqueness against existing publications. */
@Injectable()
export class SlugService {
  constructor(private prisma: PrismaService) {}

  slugify(title: string): string {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async uniqueSlug(title: string): Promise<string> {
    const base = this.slugify(title);
    let slug = base;
    let suffix = 1;
    while (await this.prisma.publication.findUnique({ where: { slug } })) {
      slug = `${base}-${suffix}`;
      suffix += 1;
    }
    return slug;
  }
}
