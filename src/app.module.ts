import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ModulesModule } from './modules/modules.module';
import { SharedModule } from './shared/shared.module';
import { AllExceptionsFilter } from './common/filters/all-exception.filter';
import { LoggingModule } from './shared/logging/logging.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ModulesModule,
    SharedModule,
    LoggingModule,
  ],
  controllers: [AppController],
  providers: [AppService,{provide:  'APP_FILTER', useClass: AllExceptionsFilter}],
})
export class AppModule {}
