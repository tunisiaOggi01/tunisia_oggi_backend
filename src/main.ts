import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ApiResponseInterceptor } from './common/api-response.interceptor';
import { AllExceptionsFilter } from './common/api-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalInterceptors(new ApiResponseInterceptor(new Reflector()));
  app.useGlobalFilters(new AllExceptionsFilter());
  const corsOrigins = (process.env.CORS_ORIGIN ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  app.enableCors({
    // Dev: reflect any origin so localhost/127.0.0.1/LAN variants all work with
    // credentials; production: strict allow-list from CORS_ORIGIN.
    origin: process.env.NODE_ENV === 'production' ? corsOrigins : true,
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
