import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import bcrypt from 'bcrypt';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Categories (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let cookie: string;
  let csrfToken: string;

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

  it('lists categories publicly with no auth', async () => {
    await request(app.getHttpServer()).get('/categories').expect(200);
  });

  it('rejects category creation without auth', async () => {
    await request(app.getHttpServer()).post('/categories').send({ name: 'Sport', slug: 'sport' }).expect(401);
  });

  it('rejects category creation without a valid CSRF token', async () => {
    await request(app.getHttpServer())
      .post('/categories')
      .set('Cookie', cookie)
      .set('X-CSRF-Token', 'wrong-token')
      .send({ name: 'Sport', slug: 'sport' })
      .expect(403);
  });

  it('creates, updates, and deletes a category when authorized', async () => {
    const create = await request(app.getHttpServer())
      .post('/categories')
      .set('Cookie', cookie)
      .set('X-CSRF-Token', csrfToken)
      .send({ name: 'Sport', slug: 'sport', color: '#059669' })
      .expect(201);

    expect(create.body.slug).toBe('sport');

    const update = await request(app.getHttpServer())
      .patch(`/categories/${create.body.id}`)
      .set('Cookie', cookie)
      .set('X-CSRF-Token', csrfToken)
      .send({ description: 'Sports news' })
      .expect(200);

    expect(update.body.description).toBe('Sports news');

    await request(app.getHttpServer())
      .delete(`/categories/${create.body.id}`)
      .set('Cookie', cookie)
      .set('X-CSRF-Token', csrfToken)
      .expect(204);
  });
});
