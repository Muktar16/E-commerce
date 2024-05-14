import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { Mail } from './email.interface';

@Injectable()
export class MailSenderService {

  logger = new Logger('RedisQueue');
  constructor(@InjectQueue('email') private emailQueue: Queue) {
    this.init();
  }

  private async init() {
    try {
      await this.delay(1000, 1);
      this.checkQueueAvailability();
    } catch (e) {
      this.logger.error(e);
    }
  }

  private checkQueueAvailability(): void {
    if (this.emailQueue.client.status === 'ready') {
      this.logger.log('Redis is ready');
    } else {
      throw new Error('Redis is not available');
    }
  }

  private delay(t: number, val: any) {
    return new Promise(function (resolve) {
      setTimeout(function () {
        resolve(val);
      }, t);
    });
  }

  async sendWelcomeEmailWithOTP(data: Mail) {
    const job = await this.emailQueue.add('otp', { data });
    return { jobId: job.id };
  }

  async sendSuperAdminWillApproveEmail(data: Mail) {
    const job = await this.emailQueue.add('super-admin-will-approve', { data });
    return { jobId: job.id };
  }

  async sendResetPasswordEmail(data: Mail) {
    const job = await this.emailQueue.add('reset-password', { data });
    return { jobId: job.id };
  }

//   async sendVerifyEmail(data: Mail) {
//     const job = await this.emailQueue.add('verify-email', { data });
//     return { jobId: job.id };
//   }

//   async sendResetPasswordEmail(data: Mail) {
//     const job = await this.emailQueue.add('verify-email', { data });
//     return { jobId: job.id };
//   }
}
