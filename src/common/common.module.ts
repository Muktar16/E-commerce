import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { SwaggerModule } from './swagger/swagger.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [DatabaseModule, SwaggerModule, ConfigModule]
})
export class CommonModule {}
