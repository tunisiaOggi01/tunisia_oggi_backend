import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import bcrypt from 'bcrypt';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';

describe('Publications admin (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let cookie: string;
  let csrfToken: string;
  let categoryId: string;

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

    await prisma.user.upsert({
      where: { email: 'admin@tunisiaoggi.com' },
      update: {},
      create: {
        email: 'admin@tunisiaoggi.com',
        username: 'admin',
        passwordHash: await bcrypt.hash('ChangeMe123!', 10),
        role: 'SUPER_ADMIN',
      },
    });
    const category = await prisma.category.create({
      data: { name: 'National', slug: 'national', color: '#8B1E1E' },
    });
    categoryId = category.id;

    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@tunisiaoggi.com', password: 'ChangeMe123!' });
    cookie = login.headers['set-cookie'][0];
    csrfToken = login.body.csrfToken;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('creates a draft under /admin/publications, generates a unique slug, and lists it in the admin listing', async () => {
    const create = await request(app.getHttpServer())
      .post('/admin/publications')
      .set('Cookie', cookie)
      .set('X-CSRF-Token', csrfToken)
      .send({ title: 'Economic Outlook 2025', categoryId, body: 'Full body text', status: 'DRAFT' })
      .expect(201);

    expect(create.body.slug).toBe('economic-outlook-2025');
    expect(create.body.status).toBe('DRAFT');

    const list = await request(app.getHttpServer())
      .get('/admin/publications')
      .set('Cookie', cookie)
      .set('X-CSRF-Token', csrfToken)
      .expect(200);

    expect(list.body.data.some((p: any) => p.id === create.body.id)).toBe(true);
  });

  it('publishes a draft via PATCH and stamps publishedAt', async () => {
    const create = await request(app.getHttpServer())
      .post('/admin/publications')
      .set('Cookie', cookie)
      .set('X-CSRF-Token', csrfToken)
      .send({ title: 'Breaking News Today', categoryId, body: 'body', status: 'DRAFT' });

    const update = await request(app.getHttpServer())
      .patch(`/admin/publications/${create.body.id}`)
      .set('Cookie', cookie)
      .set('X-CSRF-Token', csrfToken)
      .send({ status: 'PUBLISHED' })
      .expect(200);

    expect(update.body.status).toBe('PUBLISHED');
    expect(update.body.publishedAt).not.toBeNull();
  });

  it('returns dashboard stats with comments hardcoded to 0', async () => {
    const stats = await request(app.getHttpServer())
      .get('/admin/publications/stats')
      .set('Cookie', cookie)
      .set('X-CSRF-Token', csrfToken)
      .expect(200);

    expect(stats.body.comments).toBe(0);
    expect(typeof stats.body.totalArticles).toBe('number');
  });

  it('deletes a publication', async () => {
    const create = await request(app.getHttpServer())
      .post('/admin/publications')
      .set('Cookie', cookie)
      .set('X-CSRF-Token', csrfToken)
      .send({ title: 'To Be Deleted', categoryId, body: 'body', status: 'DRAFT' });

    await request(app.getHttpServer())
      .delete(`/admin/publications/${create.body.id}`)
      .set('Cookie', cookie)
      .set('X-CSRF-Token', csrfToken)
      .expect(204);
  });
});
