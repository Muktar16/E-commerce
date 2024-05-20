import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { UserEntity } from 'src/modules/v1/user/entities/user.entity';
import { Roles } from 'src/utility/common/user-roles.enum';
import { RoleGuard } from '../guards/role.guard';
import { AuthService } from './auth.service';
import { AdminSignUpDto } from './dto/auth.admin-signup.dto';
import { SignUpDto } from './dto/auth.signup.dto';
import { VerifyEmailDto } from './dto/auth.verify-email.dto';
import { EmailOnlyDto } from './dto/auth.email-only.dto';
import { SignInDto } from './dto/auth.signin.dto';
import { ChangePasswordDto } from './dto/auth.change-password.dto';
import { ResetPasswordDto } from './dto/auth.reset-password.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signUpDto: SignUpDto): Promise<{user:UserEntity,message:string}> {
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

  @Post('admin/signup')
  async adminSignup(@Body() adminSignUpDto: AdminSignUpDto): Promise<{user:UserEntity, message:string}> {
    return this.authService.adminSignUp(adminSignUpDto);
  }

  @Post('approve-admin')
  @UseGuards(AuthGuard('jwt'), new RoleGuard([Roles.SUPERADMIN]))
  async approveAdmin(@Body() emailOnlyDto: EmailOnlyDto): Promise<{user:UserEntity, message:string}> {
    return this.authService.approveAdmin(emailOnlyDto);
  }

  @Post('verify-email')
  async verifyEmail(@Body() verifyEmailDto:VerifyEmailDto) : Promise<{user:UserEntity,message:string}> {
    return this.authService.verifyEmail(verifyEmailDto);
  }

  @Post('resend-otp')
  async resendOTP(@Body() resendOTPDto:EmailOnlyDto) : Promise<string> {
    return this.authService.resendOTP(resendOTPDto);
  }

  @Post('change-password')
  @UseGuards(AuthGuard('jwt'))
  async changePassword(@Body() changePasswordDto:ChangePasswordDto, @Req() req: any,) : Promise<string> {
    changePasswordDto.email = req.user.email; 
    return this.authService.changePassword(changePasswordDto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() emailOnlyDto:EmailOnlyDto) : Promise<string> {
    return this.authService.forgotPassword(emailOnlyDto);
  }

  @Post('reset-password')
  async resetPassword(@Body() resePasswordDto:ResetPasswordDto) : Promise<string> {
    return this.authService.resetPassword(resePasswordDto);
  }
}
