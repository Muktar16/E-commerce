import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Response } from 'express';
import { LoggingService } from 'src/shared/logging/logging.service';

interface LogData {
  level: string;
  message: string;
  timestamp: string;
  context: string;
  request: {
    method: string;
    url: string;
    clientIP: string;
  };
  trace?: string;
}

@Injectable()
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly loggingService: LoggingService,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    console.log('Exception:', exception);
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }

    const logData: LogData = {
      level: status >= 500 ? 'error' : 'warn', 
      message,
      timestamp: new Date().toISOString(),
      context: 'HTTP Exception',
      request: {
        method: request.method,
        url: request.url,
        clientIP: request.ip,
      },
    };

    if (!(exception instanceof HttpException)) {
      logData.context = 'Unknown Exception';
      logData.trace = (exception as Error)?.stack;
    }

    this.loggingService.log(logData); 

    const responseBody = {
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    };

    httpAdapter.reply(response, responseBody, status);
  }
}
