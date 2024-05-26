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
import { UserResponseDto } from '../dtos/user-response.dto';
import { plainToInstance } from 'class-transformer';

@ApiTags('Auth')
@Controller('auth')
export class AuthGeneralController {
  constructor(private readonly authGeneralService: AuthGeneralService) {}

  @Post('signup/customer')
  @ApiOkResponse({ description: 'Customer signup Response' , type: UserResponseDto})
  async customerSignup(@Body() signUpDto: SignUpDto): Promise<UserResponseDto>{
    const createdUser = this.authGeneralService.customerSignup(signUpDto);
    return plainToInstance(UserResponseDto, createdUser);
  }

  @Post('signup/special')
  @ApiOkResponse({ description: 'Admin/Delivery-personnel signup Response' , type: UserResponseDto})
  async specialSignUp(@Body() specialSignUpDto: SpecialSignUpDto): Promise<UserResponseDto>{
    const createdUser =  this.authGeneralService.specialSignUp(specialSignUpDto);
    return plainToInstance(UserResponseDto, createdUser);
  }

  @Post('verify-email')
  @ApiOkResponse({ description: 'Email verification Response', type: 'User verified successfully' })
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto): Promise<UserResponseDto>{
    const verifiedUser = this.authGeneralService.verifyEmail(verifyEmailDto);
    return plainToInstance(UserResponseDto, verifiedUser);
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
