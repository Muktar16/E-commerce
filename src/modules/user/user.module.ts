import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCrudController } from './controllers/user-crud.controller';
import { UserEntity } from './entities/user.entity';
import { UserCrudService } from './providers/user-crud.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), JwtModule],
  controllers: [UserCrudController],
  providers: [UserCrudService],
  exports: [UserCrudService]
})
export class UserModule {}
