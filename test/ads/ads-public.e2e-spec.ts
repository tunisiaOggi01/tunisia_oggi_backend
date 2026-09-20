import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { ApiResponseInterceptor } from '../../src/common/api-response.interceptor';
import { AllExceptionsFilter } from '../../src/common/api-exception.filter';

describe('Ads public rotation (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const ids: Record<string, string> = {};

  const activeWindow = {
    startDate: new Date(Date.now() - 86400000),
    endDate: new Date(Date.now() + 30 * 86400000),
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

    await prisma.$executeRawUnsafe('TRUNCATE TABLE "Advertisement" CASCADE');

    const create = async (key: string, overrides: object) =>
      prisma.advertisement.create({
        data: {
          title: key,
          imageUrl: 'https://example.com/ad.png',
          linkUrl: 'https://example.com',
          placement: 'SIDEBAR',
          ...activeWindow,
          ...overrides,
        },
      });

    ids.big = (await create('big', { maxImpressions: 10000 })).id;
    ids.mid = (await create('mid', { maxImpressions: 8000 })).id;
    ids.small = (await create('small', { maxImpressions: 4000 })).id;
    ids.exhausted = (
      await create('exhausted', { impressions: 1000, maxImpressions: 1000 })
    ).id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('rotates so every budgeted active ad wins at least one slot in 60 requests', async () => {
    const seen = new Set<string>();
    for (let i = 0; i < 60; i++) {
      const res = await request(app.getHttpServer())
        .get('/public/ads?placement=SIDEBAR')
        .expect(200);
      expect(res.body.data).toHaveLength(1);
      seen.add(res.body.data[0].id);
    }
    expect(seen.has(ids.big)).toBe(true);
    expect(seen.has(ids.mid)).toBe(true);
    expect(seen.has(ids.small)).toBe(true);
  });

  it('never serves an ad whose impressions reached its budget', async () => {
    for (let i = 0; i < 15; i++) {
      const res = await request(app.getHttpServer())
        .get('/public/ads?placement=SIDEBAR')
        .expect(200);
      expect(res.body.data[0].id).not.toBe(ids.exhausted);
    }
  });
});
