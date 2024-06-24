import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { PromoController } from './controllers/promo.controller';
import { PromoEntity } from './entities/promo.entity';
import { UserPromoEntity } from './entities/user_promos.entity';
import { PromoService } from './providers/promo.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserPromoEntity, PromoEntity]),
    UserModule,
  ],
  controllers: [PromoController],
  providers: [PromoService],
  exports: [PromoService],
})
export class PromoModule {}
