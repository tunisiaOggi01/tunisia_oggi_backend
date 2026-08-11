import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';
import { SKIP_ENVELOPE } from './skip-envelope.decorator';

/** Wraps every successful response in { success, data, latency, date } unless @SkipEnvelope(). */
@Injectable()
export class ApiResponseInterceptor implements NestInterceptor {
  constructor(private reflector: Reflector) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();
    const skip = this.reflector.getAllAndOverride<boolean>(SKIP_ENVELOPE, [
      context.getHandler(),
      context.getClass(),
    ]);
    return next.handle().pipe(
      map((data: unknown) =>
        skip
          ? data
          : {
              success: true,
              data,
              latency: Date.now() - start,
              date: new Date().toISOString(),
            },
      ),
    );
  }
}
