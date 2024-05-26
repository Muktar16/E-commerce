import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { MailSenderModule } from "./mailsender/mailsender.module";
import { LoggingModule } from "./logging/logging.module";
import { SmsModule } from "./smssender/sms/sms.module";

@Module({
    imports: [AuthModule, MailSenderModule, LoggingModule, SmsModule],
})
export class SharedModule {}