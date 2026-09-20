import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/** Turns a title into a URL slug and guarantees uniqueness against existing publications. */
@Injectable()
export class SlugService {
  constructor(private prisma: PrismaService) {}

  /**
   * Converts a title into a URL-friendly slug, normalizing diacritics and falling back if empty.
   * @param title - The raw publication title
   * @returns URL-friendly slug
   */
  slugify(title: string): string {
    const slug = title
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');

    return slug || `article-${Date.now()}`;
  }

  /**
   * Generates a unique publication slug, optionally excluding the current publication ID.
   * @param title - The title to generate a slug from
   * @param currentId - Optional ID of the existing publication being updated
   * @returns A guaranteed unique slug
   */
  async uniqueSlug(title: string, currentId?: string): Promise<string> {
    const base = this.slugify(title);
    let slug = base;
    let suffix = 1;
    while (true) {
      const existing = await this.prisma.publication.findUnique({
        where: { slug },
      });
      if (!existing || (currentId && existing.id === currentId)) {
        break;
      }
      slug = `${base}-${suffix}`;
      suffix += 1;
    }
    return slug;
  }
}
