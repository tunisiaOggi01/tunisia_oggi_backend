import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import bcrypt from 'bcrypt';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { ApiResponseInterceptor } from '../src/common/api-response.interceptor';
import { AllExceptionsFilter } from '../src/common/api-exception.filter';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    app.useGlobalInterceptors(new ApiResponseInterceptor(new Reflector()));
    app.useGlobalFilters(new AllExceptionsFilter());
    await app.init();
    prisma = app.get(PrismaService);

    await prisma.$executeRawUnsafe('TRUNCATE TABLE "RefreshToken" CASCADE');
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
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('rejects a bad password', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@tunisiaoggi.com', password: 'wrongpass' })
      .expect(401);
    expect(res.body.success).toBe(false);
  });

  it('logs in with correct credentials, sets cookies, and returns user + csrfToken', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@tunisiaoggi.com', password: 'ChangeMe123!' })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('admin@tunisiaoggi.com');
    expect(typeof res.body.data.csrfToken).toBe('string');
    expect(res.body.latency).toBeGreaterThanOrEqual(0);

    const cookies = res.headers['set-cookie'];
    expect(cookies.some((c: string) => c.startsWith('access_token='))).toBe(
      true,
    );
    expect(cookies.some((c: string) => c.startsWith('refresh_token='))).toBe(
      true,
    );
  });

  it('rejects /auth/me without a cookie', async () => {
    const res = await request(app.getHttpServer()).get('/auth/me').expect(401);
    expect(res.body.success).toBe(false);
  });

  it('rejects /auth/refresh without a refresh cookie', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/refresh')
      .expect(401);
    expect(res.body.success).toBe(false);
  });

  it('accepts /auth/me with the login cookie', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@tunisiaoggi.com', password: 'ChangeMe123!' });
    const cookie = login.headers['set-cookie'][0];

    const me = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Cookie', cookie)
      .expect(200);
    expect(me.body.data.user.email).toBe('admin@tunisiaoggi.com');
  });

  it('rotates the refresh token at POST /auth/refresh', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@tunisiaoggi.com', password: 'ChangeMe123!' });
    const cookies = login.headers['set-cookie'];

    const refreshRes = await request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Cookie', cookies)
      .expect(200);

    expect(refreshRes.body.success).toBe(true);
    expect(typeof refreshRes.body.data.csrfToken).toBe('string');

    const newCookies = refreshRes.headers['set-cookie'];
    expect(newCookies.some((c: string) => c.startsWith('access_token='))).toBe(
      true,
    );
    expect(newCookies.some((c: string) => c.startsWith('refresh_token='))).toBe(
      true,
    );
    // Old refresh token no longer works once the new one leaves the grace window
    await prisma.refreshToken.updateMany({
      where: { isRevoked: false },
      data: { createdAt: new Date(Date.now() - 5 * 60 * 1000) },
    });
    await request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Cookie', cookies)
      .expect(401);
  });

  it('tolerates an immediate concurrent refresh with the old cookie', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@tunisiaoggi.com', password: 'ChangeMe123!' });
    const cookies = login.headers['set-cookie'];

    await request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Cookie', cookies)
      .expect(200);
    await request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Cookie', cookies)
      .expect(200);
  });

  it('rate-limits account creation to 5 per minute per IP', async () => {
    for (let i = 1; i <= 5; i++) {
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: `e2e-register-${i}@test.it`,
          password: 'Register123!',
          username: `e2ereg${i}`,
        })
        .expect(201);
    }
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'e2e-register-6@test.it',
        password: 'Register123!',
        username: 'e2ereg6',
      })
      .expect(429);
  });
});
