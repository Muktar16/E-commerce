import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/enums/user-roles.enum';
import { ResponseType } from 'src/common/interfaces/response.interface';
import { RoleGuard } from '../../guards/role.guard';
import { SpecialSignUpDto } from '../dtos/auth.admin-signup.dto';
import { ChangePasswordDto } from '../dtos/auth.change-password.dto';
import { EmailOnlyDto } from '../dtos/auth.email-only.dto';
import { ResetPasswordDto } from '../dtos/auth.reset-password.dto';
import { SignInDto } from '../dtos/auth.signin.dto';
import { SignUpDto } from '../dtos/auth.signup.dto';
import { VerifyEmailDto } from '../dtos/auth.verify-email.dto';
import { AuthGeneralService } from '../providers/auth-general.service';
import { SignupResponseDto } from '../dtos/signup-response.dto';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from 'src/modules/user/entities/user.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthGeneralController {
  constructor(private readonly authGeneralService: AuthGeneralService) {}

  @Post('signup/customer')
  @ApiOkResponse({ description: 'Customer signup Response' , type: SignupResponseDto})
  async customerSignup(@Body() signUpDto: SignUpDto):Promise<SignupResponseDto> {
    const createdUser = await this.authGeneralService.customerSignup(signUpDto);
    return plainToInstance(UserEntity, createdUser);
  }

  @Post('signup/special')
  async specialSignUp(@Body() specialSignUpDto: SpecialSignUpDto) {
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
  async approveAdmin(
    @Body() emailOnlyDto: EmailOnlyDto,
  ): Promise<ResponseType> {
    return this.authGeneralService.approveAdmin(emailOnlyDto);
  }

  @Post('approve-delivery-person')
  @UseGuards(AuthGuard('jwt'), new RoleGuard([Roles.SUPERADMIN, Roles.ADMIN]))
  async approveDeliveryAgent(
    @Body() emailOnlyDto: EmailOnlyDto,
  ): Promise<ResponseType> {
    return this.authGeneralService.approveDeliveryAgent(emailOnlyDto);
  }

  @Post('verify-email')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authGeneralService.verifyEmail(verifyEmailDto);
  }

  @Post('resend-otp')
  async resendOTP(@Body() resendOTPDto: EmailOnlyDto): Promise<string> {
    return this.authGeneralService.resendOTP(resendOTPDto);
  }

  @Post('change-password')
  @UseGuards(AuthGuard('jwt'))
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: any,
  ): Promise<ResponseType> {
    changePasswordDto.email = req.user.email;
    return this.authGeneralService.changePassword(changePasswordDto);
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() emailOnlyDto: EmailOnlyDto,
  ): Promise<ResponseType> {
    return this.authGeneralService.forgotPassword(emailOnlyDto);
  }

  @Post('reset-password')
  async resetPassword(
    @Body() resePasswordDto: ResetPasswordDto,
  ): Promise<ResponseType> {
    return this.authGeneralService.resetPassword(resePasswordDto);
  }
}
