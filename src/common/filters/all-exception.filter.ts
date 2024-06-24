import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';
import { Response } from 'express';
import { LoggingService } from 'src/shared/logging/logging.service';

interface ErrorResponse {
  status?: string;
  statusCode: number;
  message: string;
  method?: string;
  timestamp?: string;
  path?: string;
  error?: any;
}

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
    private configService: ConfigService,
  ) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const isProduction = this.configService.get('NODE_ENV') === 'production';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      if (isProduction) message = exception.message;
      else
        message = (exception as any).getResponse().message || exception.message;
    }

    Logger.error(
      `${request.method} ${request.url}`,
      JSON.stringify(exception),
      'ExceptionFilter',
    );

    // Log the error in production mode
    if (isProduction) {
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
    }

    let responseBody: ErrorResponse = undefined;
    if (isProduction) {
      responseBody = {
        status: 'error',
        statusCode: status,
        message,
      };
    } else {
      responseBody = {
        statusCode: status,
        message,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        error: exception,
      };
    }
    // Logger.error(`${request.method} ${request.url}`, JSON.stringify(responseBody), 'ExceptionFilter');
    httpAdapter.reply(response, responseBody, status);
  }
}
