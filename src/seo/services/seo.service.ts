import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

const STATIC_PAGES = ['', 'directory', 'search'];

/** Builds robots.txt + XML sitemap from the published-publication inventory. */
@Injectable()
export class SeoService {
  constructor(private prisma: PrismaService) {}

  private get baseUrl(): string {
    return process.env.APP_URL ?? 'http://localhost:3000';
  }

  /** robots.txt — allows everything except the admin panel, points at the sitemap. */
  robots(): string {
    const base = this.baseUrl;
    return [
      'User-agent: *',
      'Disallow: /admin',
      'Disallow: /profile',
      `Sitemap: ${base}/seo/sitemap.xml`,
      '',
    ].join('\n');
  }

  /** XML sitemap: static pages + all published articles with their last-update date. */
  async sitemap(): Promise<string> {
    const base = this.baseUrl;
    const published = await this.prisma.publication.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
    });
    const urls = STATIC_PAGES.map((path) => ({
      loc: `${base}/${path}`,
      lastmod: new Date().toISOString().slice(0, 10),
    }));
    urls.push(
      ...published.map((p) => ({
        loc: `${base}/article/${p.slug}`,
        lastmod: p.updatedAt.toISOString().slice(0, 10),
      })),
    );
    const body = urls
      .map(
        (u) =>
          `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod}</lastmod>\n  </url>`,
      )
      .join('\n');
    return [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      body,
      '</urlset>',
      '',
    ].join('\n');
  }
}
