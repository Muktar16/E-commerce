import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SigninUserDto } from './dto/signin-user.dto';
import { SignupUserDto } from './dto/signup-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';
// import { CurrentUserMiddleware } from 'src/utility/middlewares/current-user.middleware';

@ApiTags ('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() signupUserDto: SignupUserDto):Promise<UserEntity> {
    return await this.userService.signup(signupUserDto);
  }

  @Post('signin')
  async signin(@Body() signinUserDto: SigninUserDto):Promise<{accessToken:string,user:UserEntity}> {
    return await this.userService.signin(signinUserDto);
  }

  @Get()
  async findAll():Promise<UserEntity[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string):Promise<UserEntity> {
    return this.userService.findOneById(+id);
  }

  // @Get('user')
  // async findMe(@CurrentUserMiddleware() currentUser: UserEntity) {
  //   return this.userService.findMe();
  // }

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.create(createUserDto);
  // }

  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
