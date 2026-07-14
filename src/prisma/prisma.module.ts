import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/** Global module exposing PrismaService to every feature module without re-importing it each time. */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
