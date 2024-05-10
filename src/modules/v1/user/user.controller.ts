import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { Sign } from 'crypto';
import { SignupUserDto } from './dto/signup-user.dto';
import { UserEntity } from './entities/user.entity';
import { SigninUserDto } from './dto/signin-user.dto';

@ApiTags ('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() signupUserDto: SignupUserDto):Promise<UserEntity> {
    return await this.userService.signup(signupUserDto);
  }

  @Post('signin')
  async signin(@Body() signinUserDto: SigninUserDto):Promise<UserEntity> {
    return await this.userService.signin(signinUserDto);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
