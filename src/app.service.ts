import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    // throw new HttpException('Method not implemented yet', HttpStatus.NOT_IMPLEMENTED);
    console.log('Hello from AppService');
    return 'Welcome to Easy Mart, your one stop shop for all your grocery needs!';
  }
}
