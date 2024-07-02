import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartModule } from 'src/modules/cart/cart.module';
import { UserModule } from 'src/modules/user/user.module';
import { MailSenderModule } from '../mailsender/mailsender.module';
import { AuthGeneralController } from './controllers/auth-general.controller';
import { SessionEntity } from './entities/sessions.entity';
import { AuthGeneralService } from './providers/auth-general.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    UserModule,
    JwtModule,
    PassportModule,
    MailSenderModule,
    CartModule,
    TypeOrmModule.forFeature([SessionEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthGeneralController],
  providers: [AuthGeneralService, LocalStrategy, JwtStrategy],
  exports: [AuthGeneralService],
})
export class AuthModule {}
