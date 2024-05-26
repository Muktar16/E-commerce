import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ResponseFormat<T> {
  status: string;
  statusCode: number;
  message: string;
  timestamp: string;
  data: T;
  error?: {
    code?: string;
    details?: string;
  };
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ResponseFormat<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ResponseFormat<T>> {
    return next.handle().pipe(
      map(data => ({
        status: 'success',
        statusCode: context.switchToHttp().getResponse().statusCode,
        message: 'Request successful',
        timestamp: new Date().toISOString(),
        data,
      })),
    );
  }
}
