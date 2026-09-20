import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { ApiResponseInterceptor } from '../../src/common/api-response.interceptor';
import { AllExceptionsFilter } from '../../src/common/api-exception.filter';

describe('Search public (e2e)', () => {
  let app: INestApplication;

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
  });

  afterAll(async () => {
    await app.close();
  });

  it('rejects a query longer than 100 characters', async () => {
    await request(app.getHttpServer())
      .get(`/public/search?q=${'a'.repeat(101)}`)
      .expect(400);
  });

  it('rejects a pageSize above 100', async () => {
    await request(app.getHttpServer())
      .get('/public/search?q=ristorante&pageSize=101')
      .expect(400);
  });

  it('rate-limits public search to 20 requests per minute per IP', async () => {
    for (let i = 0; i < 18; i++) {
      await request(app.getHttpServer())
        .get('/public/search?q=ristorante')
        .expect(200);
    }
    await request(app.getHttpServer())
      .get('/public/search?q=ristorante')
      .expect(429);
  });
});
