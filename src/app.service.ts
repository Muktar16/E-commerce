import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    throw new Error('Method not implemented.');
    // return 'Welcome to Easy Mart, your one stop shop for all your grocery needs!';
  }
}
