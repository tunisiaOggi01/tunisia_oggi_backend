import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ApiResponseInterceptor } from './common/api-response.interceptor';
import { AllExceptionsFilter } from './common/api-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalInterceptors(new ApiResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.enableCors({ origin: process.env.CORS_ORIGIN, credentials: true });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
