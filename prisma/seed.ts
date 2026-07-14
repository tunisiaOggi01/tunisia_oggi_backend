import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/** Seeds the initial SUPER_ADMIN user and the 6 launch categories. Idempotent via upsert. */
async function main() {
  const passwordHash = await bcrypt.hash('ChangeMe123!', 10);

  await prisma.user.upsert({
    where: { email: 'admin@tunisiaoggi.com' },
    update: {},
    create: { email: 'admin@tunisiaoggi.com', username: 'admin', passwordHash, role: Role.SUPER_ADMIN },
  });

  const categories = [
    { name: 'National', slug: 'national', color: '#8B1E1E' },
    { name: 'Politics', slug: 'politics', color: '#1E3A8A' },
    { name: 'Community', slug: 'community', color: '#4B5563' },
    { name: 'Culture', slug: 'culture', color: '#8B1E1E' },
    { name: 'Economy', slug: 'economy', color: '#1E3A8A' },
    { name: 'Environment', slug: 'environment', color: '#78716C' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({ where: { slug: category.slug }, update: {}, create: category });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
