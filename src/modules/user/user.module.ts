import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserCrudController } from './controllers/user-crud.controller';
import { UserCrudService } from './providers/user-crud.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), JwtModule],
  controllers: [UserCrudController],
  providers: [UserCrudService],
  exports: [UserCrudService]
})
export class UserModule {}
