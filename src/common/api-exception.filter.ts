import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

/** Catches every unhandled exception, logs it, and returns { success:false, error, latency, date }. */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const start = Date.now();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    console.error(
      `[${new Date().toISOString()}] ${status} ${host.switchToHttp().getRequest().method} ${host.switchToHttp().getRequest().url}`,
    );
    console.error(exception);

    response.status(status).json({
      success: false,
      error:
        typeof message === 'string'
          ? message
          : ((message as any).message ?? 'Internal server error'),
      latency: Date.now() - start,
      date: new Date().toISOString(),
    });
  }
}
