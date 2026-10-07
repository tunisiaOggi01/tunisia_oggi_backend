import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/** Injectable Prisma client — the repository layer every feature service depends on. */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    // Vercel's Prisma Postgres integration injects POSTGRES_URL; DATABASE_URL wins when set (local/Docker).
    super({
      datasourceUrl: process.env.DATABASE_URL ?? process.env.POSTGRES_URL,
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
