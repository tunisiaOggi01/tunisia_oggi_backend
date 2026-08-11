import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import bcrypt from 'bcrypt';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/prisma/prisma.service';
import { ApiResponseInterceptor } from '../../src/common/api-response.interceptor';
import { AllExceptionsFilter } from '../../src/common/api-exception.filter';

describe('Listings public (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let cookie: string;

  const submitPayload = {
    businessName: 'Trattoria Roma',
    category: 'RESTAURANT',
    phone: '+216 22 345 678',
    email: 'info@trattoriaroma.tn',
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
    app.useGlobalInterceptors(new ApiResponseInterceptor());
    app.useGlobalFilters(new AllExceptionsFilter());
    await app.init();
    prisma = app.get(PrismaService);

    await prisma.$executeRawUnsafe('TRUNCATE TABLE "RefreshToken" CASCADE');
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "BusinessListing" CASCADE');
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
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('rejects a submission without authentication', async () => {
    await request(app.getHttpServer())
      .post('/listings')
      .send(submitPayload)
      .expect(401);
  });

  it('accepts an authenticated submission as PENDING and stores the creator', async () => {
    const submit = await request(app.getHttpServer())
      .post('/listings')
      .set('Cookie', cookie)
      .send(submitPayload)
      .expect(201);

    const admin = await prisma.user.findUnique({
      where: { email: 'admin@tunisiaoggi.com' },
    });
    expect(submit.body.data.status).toBe('PENDING');
    expect(submit.body.data.createdById).toBe(admin!.id);
    expect(submit.body.data.searchText).toBe(
      'trattoria roma +21622345678 info@trattoriaroma.tn',
    );
  });

  it('conflicts on an exact businessName + phone duplicate', async () => {
    await request(app.getHttpServer())
      .post('/listings')
      .set('Cookie', cookie)
      .send({
        businessName: 'Trattoria Roma',
        category: 'RESTAURANT',
        phone: '+216 22 345 678',
        email: 'altro@trattoriaroma.tn',
      })
      .expect(409);
  });

  it('excludes PENDING listings from public browse', async () => {
    const browse = await request(app.getHttpServer())
      .get('/public/listings')
      .expect(200);
    expect(browse.body.data.some((l: any) => l.businessName === 'Trattoria Roma')).toBe(false);
  });

  it('shows an APPROVED listing in public browse, filterable by category', async () => {
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@tunisiaoggi.com' },
    });
    await prisma.businessListing.create({
      data: {
        businessName: 'Studio Legale Milano',
        category: 'LAW',
        phone: '+216 98 765 432',
        email: 'contact@studiomilano.tn',
        status: 'APPROVED',
        createdById: admin!.id,
      },
    });

    const all = await request(app.getHttpServer())
      .get('/public/listings')
      .expect(200);
    expect(all.body.data.some((l: any) => l.businessName === 'Studio Legale Milano')).toBe(true);

    const filtered = await request(app.getHttpServer())
      .get('/public/listings?category=RESTAURANT')
      .expect(200);
    expect(filtered.body.data.some((l: any) => l.businessName === 'Studio Legale Milano')).toBe(false);
  });

  it('returns an APPROVED listing by id and 404s for PENDING or unknown ids', async () => {
    const approved = await prisma.businessListing.findFirst({
      where: { businessName: 'Studio Legale Milano' },
    });

    const detail = await request(app.getHttpServer())
      .get(`/public/listings/${approved!.id}`)
      .expect(200);
    expect(detail.body.data.id).toBe(approved!.id);

    const pending = await prisma.businessListing.findFirst({
      where: { businessName: 'Trattoria Roma' },
    });
    await request(app.getHttpServer())
      .get(`/public/listings/${pending!.id}`)
      .expect(404);
    await request(app.getHttpServer())
      .get('/public/listings/00000000-0000-0000-0000-000000000000')
      .expect(404);
  });
});