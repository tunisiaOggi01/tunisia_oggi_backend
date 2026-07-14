import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import bcrypt from 'bcrypt';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.use(cookieParser());
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
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('rejects a bad password', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@tunisiaoggi.com', password: 'wrongpass' })
      .expect(401);
  });

  it('logs in with correct credentials, sets a cookie, and returns a csrfToken', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@tunisiaoggi.com', password: 'ChangeMe123!' })
      .expect(200);

    expect(res.body.user.email).toBe('admin@tunisiaoggi.com');
    expect(typeof res.body.csrfToken).toBe('string');
    expect(res.headers['set-cookie'][0]).toMatch(/access_token=/);
  });

  it('rejects /auth/me without a cookie', async () => {
    await request(app.getHttpServer()).get('/auth/me').expect(401);
  });

  it('accepts /auth/me with the login cookie', async () => {
    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@tunisiaoggi.com', password: 'ChangeMe123!' });
    const cookie = login.headers['set-cookie'][0];

    const me = await request(app.getHttpServer()).get('/auth/me').set('Cookie', cookie).expect(200);
    expect(me.body.email).toBe('admin@tunisiaoggi.com');
  });
});
