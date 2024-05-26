import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log('Hello from AppService');
    return 'Welcome to Easy Mart, your one stop shop for all your grocery needs!';
  }
}
