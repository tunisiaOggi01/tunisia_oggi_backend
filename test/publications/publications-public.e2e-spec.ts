import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('Publications public (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let publishedId: string;
  let publishedSlug: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
    prisma = app.get(PrismaService);

    await prisma.$executeRawUnsafe('TRUNCATE TABLE "Publication" CASCADE');
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "Category" CASCADE');
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "User" CASCADE');

    const category = await prisma.category.create({
      data: { name: 'National', slug: 'national', color: '#8B1E1E' },
    });

    const user = await prisma.user.create({
      data: { email: 'admin@tunisiaoggi.com', username: 'admin', passwordHash: 'x', role: 'SUPER_ADMIN' },
    });

    const published = await prisma.publication.create({
      data: {
        title: 'Published Article',
        slug: 'published-article',
        body: 'body',
        status: 'PUBLISHED',
        publishedAt: new Date(),
        authorId: user.id,
        categoryId: category.id,
      },
    });
    publishedId = published.id;
    publishedSlug = published.slug;

    await prisma.publication.create({
      data: {
        title: 'Draft Article',
        slug: 'draft-article',
        body: 'body',
        status: 'DRAFT',
        authorId: user.id,
        categoryId: category.id,
      },
    });

    await prisma.publication.create({
      data: {
        title: 'Related Article',
        slug: 'related-article',
        body: 'body',
        status: 'PUBLISHED',
        publishedAt: new Date(),
        authorId: user.id,
        categoryId: category.id,
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('lists only PUBLISHED publications', async () => {
    const res = await request(app.getHttpServer()).get('/publications?status=PUBLISHED').expect(200);
    const titles = res.body.data.map((p: any) => p.title);
    expect(titles).toContain('Published Article');
    expect(titles).not.toContain('Draft Article');
  });

  it('404s on a draft slug', async () => {
    await request(app.getHttpServer()).get('/publications/draft-article').expect(404);
  });

  it('returns a published article by slug and increments its view count', async () => {
    const first = await request(app.getHttpServer()).get(`/publications/${publishedSlug}`).expect(200);
    expect(first.body.views).toBe(1);

    const second = await request(app.getHttpServer()).get(`/publications/${publishedSlug}`).expect(200);
    expect(second.body.views).toBe(2);
  });

  it('returns related articles in the same category excluding itself', async () => {
    const res = await request(app.getHttpServer()).get(`/publications/${publishedSlug}/related`).expect(200);
    expect(res.body.every((p: any) => p.id !== publishedId)).toBe(true);
    expect(res.body.some((p: any) => p.title === 'Related Article')).toBe(true);
  });
});
