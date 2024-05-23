import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { MailSenderModule } from "./mailsender/mailsender.module";
import { LoggingModule } from "./logging/logging.module";

@Module({
    imports: [AuthModule, MailSenderModule, LoggingModule],
})
export class SharedModule {}