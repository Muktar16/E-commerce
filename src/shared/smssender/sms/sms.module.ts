import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { TwilioModule, TwilioService } from 'nestjs-twilio';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make ConfigModule available globally
    }),
    TwilioModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        accountSid: configService.get<string>('TWILIO_ACCOUNT_SID'),
        authToken: configService.get<string>('TWILIO_AUTH_TOKEN'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [SmsService, TwilioService],
  exports: [SmsService],
})
export class SmsModule {}
