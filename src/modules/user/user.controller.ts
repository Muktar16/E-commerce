import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags ('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll():Promise<UserEntity[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string):Promise<UserEntity> {
    return this.userService.findOneById(+id);
  }

}
