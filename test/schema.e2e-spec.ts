import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL_TEST } },
});

describe('Prisma schema constraints', () => {
  afterEach(async () => {
    await prisma.publication.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('rejects two categories with the same slug', async () => {
    await prisma.category.create({ data: { name: 'Politics', slug: 'politics', color: '#1E3A8A' } });

    await expect(
      prisma.category.create({ data: { name: 'Politics Duplicate', slug: 'politics', color: '#1E3A8A' } }),
    ).rejects.toThrow();
  });

  it('rejects two publications with the same slug', async () => {
    const user = await prisma.user.create({
      data: { email: 'editor@tunisiaoggi.com', username: 'editor', passwordHash: 'x', role: 'EDITOR' },
    });
    const category = await prisma.category.create({ data: { name: 'National', slug: 'national', color: '#8B1E1E' } });

    await prisma.publication.create({
      data: { title: 'First', slug: 'first-article', body: 'body', authorId: user.id, categoryId: category.id },
    });

    await expect(
      prisma.publication.create({
        data: { title: 'Second', slug: 'first-article', body: 'body', authorId: user.id, categoryId: category.id },
      }),
    ).rejects.toThrow();
  });
});
