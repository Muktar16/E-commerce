import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { Roles } from 'src/utility/common/user-roles.enum';
import { RoleGuard } from '../../guards/role.guard';
import { SignUpDto } from '../dto/auth.signup.dto';
import { VerifyEmailDto } from '../dto/auth.verify-email.dto';
import { EmailOnlyDto } from '../dto/auth.email-only.dto';
import { SignInDto } from '../dto/auth.signin.dto';
import { ChangePasswordDto } from '../dto/auth.change-password.dto';
import { ResetPasswordDto } from '../dto/auth.reset-password.dto';
import { ResponseType } from 'src/utility/interfaces/response.interface';
import { AuthGeneralService } from '../providers/auth-general.service';
import { SpecialSignUpDto } from '../dto/auth.admin-signup.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthGeneralController {
  constructor(private readonly authGeneralService: AuthGeneralService) {}

  @Post('signup')
  async signup(@Body() signUpDto: SignUpDto): Promise<ResponseType> {
    return this.authGeneralService.signUp(signUpDto);
  }

  @Post('signup/special')
  async specialSignUp(@Body() specialSignUpDto: SpecialSignUpDto): Promise<{user:UserEntity, message:string}> {
    return this.authGeneralService.specialSignUp(specialSignUpDto);
  }

  @Post('signin')
  @UseGuards(AuthGuard('local'))
  async signin(
    @Body() signInDto: SignInDto,
    @Req() req: any,
  ): Promise<ResponseType> {
    return this.authGeneralService.signIn(req.user);
  }

  @Post('approve-admin')
  @UseGuards(AuthGuard('jwt'), new RoleGuard([Roles.SUPERADMIN]))
  async approveAdmin(@Body() emailOnlyDto: EmailOnlyDto): Promise<ResponseType> {
    return this.authGeneralService.approveAdmin(emailOnlyDto);
  }


  @Post('approve-delivery-person')
  @UseGuards(AuthGuard('jwt'), new RoleGuard([Roles.SUPERADMIN, Roles.ADMIN]))
  async approveDeliveryAgent(@Body() emailOnlyDto: EmailOnlyDto): Promise<ResponseType> {
    return this.authGeneralService.approveDeliveryAgent(emailOnlyDto);
  }

  @Post('verify-email')
  async verifyEmail(@Body() verifyEmailDto:VerifyEmailDto) : Promise<{user:UserEntity,message:string}> {
    return this.authGeneralService.verifyEmail(verifyEmailDto);
  }

  @Post('resend-otp')
  async resendOTP(@Body() resendOTPDto:EmailOnlyDto) : Promise<string> {
    return this.authGeneralService.resendOTP(resendOTPDto);
  }

  @Post('change-password')
  @UseGuards(AuthGuard('jwt'))
  async changePassword(@Body() changePasswordDto:ChangePasswordDto, @Req() req: any,) : Promise<ResponseType> {
    changePasswordDto.email = req.user.email; 
    return this.authGeneralService.changePassword(changePasswordDto);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() emailOnlyDto:EmailOnlyDto) : Promise<ResponseType> {
    return this.authGeneralService.forgotPassword(emailOnlyDto);
  }

  @Post('reset-password')
  async resetPassword(@Body() resePasswordDto:ResetPasswordDto) : Promise<ResponseType> {
    return this.authGeneralService.resetPassword(resePasswordDto);
  }
}
