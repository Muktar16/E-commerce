import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { SignInDto } from './dto/auth.signin.dto';
import { AuthService } from './auth.service';
import { UserEntity } from 'src/modules/v1/user/entities/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { SignUpDto } from './dto/auth.signup.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signUpDto: SignUpDto): Promise<UserEntity> {
    return this.authService.signUp(signUpDto);
  }

  @Post('signin')
  @UseGuards(AuthGuard('local'))
  async signin(
    @Body() signInDto: SignInDto,
    @Req() req: any,
  ): Promise<{ accessToken: string; user: UserEntity }> {
    return this.authService.signIn(req.user);
  }
}
