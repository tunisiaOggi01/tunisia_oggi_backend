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

describe('Ads admin budget (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let cookie: string;
  let csrfToken: string;

  const baseAd = {
    title: 'Budgeted ad',
    imageUrl: 'https://example.com/ad.png',
    linkUrl: 'https://example.com',
    placement: 'SIDEBAR',
    startDate: new Date(Date.now() - 86400000).toISOString(),
    endDate: new Date(Date.now() + 30 * 86400000).toISOString(),
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
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "Advertisement" CASCADE');
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
    csrfToken = login.body.data.csrfToken;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('persists maxImpressions on create and reflects it in the admin list', async () => {
    const created = await request(app.getHttpServer())
      .post('/admin/ads')
      .set('Cookie', cookie)
      .set('X-CSRF-Token', csrfToken)
      .send({ ...baseAd, maxImpressions: 5000 })
      .expect(201);
    expect(created.body.data.maxImpressions).toBe(5000);

    const list = await request(app.getHttpServer())
      .get('/admin/ads')
      .set('Cookie', cookie)
      .expect(200);
    const row = list.body.data.data.find(
      (a: any) => a.id === created.body.data.id,
    );
    expect(row.budgetExhausted).toBe(false);
    expect(row.remainingImpressions).toBe(5000);
  });

  it('maps budgetExhausted to true once impressions reach the cap', async () => {
    const target = await prisma.advertisement.findFirst({
      where: { title: 'Budgeted ad' },
    });
    await prisma.advertisement.update({
      where: { id: target!.id },
      data: { impressions: 5000 },
    });

    const list = await request(app.getHttpServer())
      .get('/admin/ads')
      .set('Cookie', cookie)
      .expect(200);
    const row = list.body.data.data.find((a: any) => a.id === target!.id);
    expect(row.budgetExhausted).toBe(true);
    expect(row.remainingImpressions).toBe(0);
  });

  it('maps unlimited ads to null budget fields', async () => {
    const created = await request(app.getHttpServer())
      .post('/admin/ads')
      .set('Cookie', cookie)
      .set('X-CSRF-Token', csrfToken)
      .send({ ...baseAd, title: 'Unlimited ad' })
      .expect(201);
    expect(created.body.data.maxImpressions).toBeNull();

    const list = await request(app.getHttpServer())
      .get('/admin/ads')
      .set('Cookie', cookie)
      .expect(200);
    const row = list.body.data.data.find(
      (a: any) => a.id === created.body.data.id,
    );
    expect(row.budgetExhausted).toBe(false);
    expect(row.remainingImpressions).toBeNull();
  });

  it('rejects budgets below 1 or non-numeric input', async () => {
    await request(app.getHttpServer())
      .post('/admin/ads')
      .set('Cookie', cookie)
      .set('X-CSRF-Token', csrfToken)
      .send({ ...baseAd, maxImpressions: 0 })
      .expect(400);
    await request(app.getHttpServer())
      .post('/admin/ads')
      .set('Cookie', cookie)
      .set('X-CSRF-Token', csrfToken)
      .send({ ...baseAd, maxImpressions: 'abc' })
      .expect(400);
  });
});
