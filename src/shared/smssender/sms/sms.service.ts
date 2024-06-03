import { Injectable } from '@nestjs/common';
import { TwilioService } from 'nestjs-twilio';

@Injectable()
export class SmsService {
  public constructor(private readonly twilioService: TwilioService) {
    // this.twilioService.client.verify(services: 'sms')
  }

  async sendSMS(): Promise<any> {
    // Annotate the return type
    return await this.twilioService.client.messages.create({
      body: 'SMS Body, sent to the phone!',
      from: '+14235654163',
      to: '88001747963178',
    });
  }
}
