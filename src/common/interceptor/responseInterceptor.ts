import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now(); // Time the request was received
    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - now; // Calculate response time
        console.log(`Response time: ${responseTime}ms`);
      }),
      map((data) => {
        const response = context.switchToHttp().getResponse();
        const request = context.switchToHttp().getRequest();
        const statusCode = response.statusCode;

        // Determine the message based on the status code
        const message =
          statusCode >= 200 && statusCode < 300 ? 'Success' : 'Fail';

        return {
          statusCode: statusCode,
          message: message,
          timestamp: new Date().toISOString(),
          path: request.url,
          method: request.method,
          responseTime: `${Date.now() - now}ms`,
          content: data,
        };
      }),
    );
  }
}
