import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ModulesModule } from './modules/modules.module';
// import { CurrentUserMiddleware } from './utility/middlewares/current-user.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // LoggerModule.forRoot(loggerOptions),
    ModulesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(CurrentUserMiddleware)
  //     .forRoutes({path:'*', method: RequestMethod.ALL});
  // }
}
