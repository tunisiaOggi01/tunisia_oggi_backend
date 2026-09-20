/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument */
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import bcrypt from 'bcrypt';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { ApiResponseInterceptor } from '../../src/common/api-response.interceptor';
import { AllExceptionsFilter } from '../../src/common/api-exception.filter';

describe('Publications admin access control (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminCookie: string;
  let adminCsrf: string;
  let editorCookie: string;
  let editorCsrf: string;
  let visitorCookie: string;
  let categoryId: string;
  let adminPubId: string;

  const login = async (email: string, password: string) => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email, password });
    return {
      cookie: res.headers['set-cookie'][0],
      csrf: res.body.data.csrfToken,
    };
  };

  const seedUser = async (email: string, username: string, role: string) => {
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        username,
        passwordHash: await bcrypt.hash('Test12345!', 10),
        role: role as any,
      },
    });
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    app.useGlobalInterceptors(new ApiResponseInterceptor(new Reflector()));
    app.useGlobalFilters(new AllExceptionsFilter());
    await app.init();
    prisma = app.get(PrismaService);

    await prisma.$executeRawUnsafe('TRUNCATE TABLE "RefreshToken" CASCADE');
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "Publication" CASCADE');
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "Category" CASCADE');
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "User" CASCADE');

    await seedUser('admin@tunisiaoggi.com', 'admin', 'SUPER_ADMIN');
    await seedUser('editor2@test.it', 'editor2', 'EDITOR');
    await seedUser('visitor2@test.it', 'visitor2', 'VISITOR');

    const category = await prisma.category.create({
      data: { name: 'National', slug: 'national', color: '#8B1E1E' },
    });
    categoryId = category.id;

    const admin = await login('admin@tunisiaoggi.com', 'Test12345!');
    adminCookie = admin.cookie;
    adminCsrf = admin.csrf;
    const editor = await login('editor2@test.it', 'Test12345!');
    editorCookie = editor.cookie;
    editorCsrf = editor.csrf;
    const visitor = await login('visitor2@test.it', 'Test12345!');
    visitorCookie = visitor.cookie;

    const adminPub = await request(app.getHttpServer())
      .post('/admin/publications')
      .set('Cookie', adminCookie)
      .set('X-CSRF-Token', adminCsrf)
      .send({
        title: 'Admin Secret Draft',
        categoryId,
        body: 'admin draft body',
        status: 'DRAFT',
      });
    adminPubId = adminPub.body.data.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('denies a VISITOR the admin publication list', async () => {
    await request(app.getHttpServer())
      .get('/admin/publications')
      .set('Cookie', visitorCookie)
      .expect(403);
  });

  it('denies a VISITOR reading another user draft by id', async () => {
    await request(app.getHttpServer())
      .get(`/admin/publications/${adminPubId}`)
      .set('Cookie', visitorCookie)
      .expect(403);
  });

  it('scopes the admin list to the EDITOR own publications only', async () => {
    await request(app.getHttpServer())
      .post('/admin/publications')
      .set('Cookie', editorCookie)
      .set('X-CSRF-Token', editorCsrf)
      .send({
        title: 'Editor Own Draft',
        categoryId,
        body: 'editor body',
        status: 'DRAFT',
      })
      .expect(201);

    const list = await request(app.getHttpServer())
      .get('/admin/publications')
      .set('Cookie', editorCookie)
      .expect(200);

    const items = list.body.data.data as any[];
    expect(items.length).toBe(1);
    expect(items[0].title).toBe('Editor Own Draft');
    expect(items[0].id).not.toBe(adminPubId);
  });

  it('denies an EDITOR reading another user draft by id', async () => {
    await request(app.getHttpServer())
      .get(`/admin/publications/${adminPubId}`)
      .set('Cookie', editorCookie)
      .expect(403);
  });

  it('allows an EDITOR reading their own draft by id', async () => {
    const list = await request(app.getHttpServer())
      .get('/admin/publications')
      .set('Cookie', editorCookie)
      .expect(200);
    await request(app.getHttpServer())
      .get(`/admin/publications/${list.body.data.data[0].id}`)
      .set('Cookie', editorCookie)
      .expect(200);
  });

  it('denies stats to an EDITOR', async () => {
    await request(app.getHttpServer())
      .get('/admin/publications/stats')
      .set('Cookie', editorCookie)
      .expect(403);
  });

  it('returns stats to a SUPER_ADMIN', async () => {
    await request(app.getHttpServer())
      .get('/admin/publications/stats')
      .set('Cookie', adminCookie)
      .expect(200);
  });

  it('caps newsletter subscriber pageSize at 100', async () => {
    await request(app.getHttpServer())
      .get('/admin/newsletter/subscribers?pageSize=999999')
      .set('Cookie', adminCookie)
      .expect(400);
  });
});
