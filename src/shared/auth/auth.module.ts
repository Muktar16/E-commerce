import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/modules/user/user.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MailSenderModule } from '../mailsender/mailsender.module';
import { CartModule } from 'src/modules/cart/cart.module';
import { AuthGeneralController } from './controllers/auth-general.controller';
import { AuthGeneralService } from './providers/auth-general.service';

@Module({
  imports: [
    UserModule,
    JwtModule,
    PassportModule,
    MailSenderModule,
    CartModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Replace with your own secret key
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') }, // Adjust token expiration as needed
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthGeneralController],
  providers: [AuthGeneralService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
