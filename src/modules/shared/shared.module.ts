import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { MailSenderModule } from "./mailsender/mailsender.module";

@Module({
    imports: [AuthModule, MailSenderModule],
})
export class SharedModule {}