import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, map } from 'rxjs';

/** Wraps every successful response in { success, data, latency, date }. */
@Injectable()
export class ApiResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        latency: Date.now() - start,
        date: new Date().toISOString(),
      })),
    );
  }
}
