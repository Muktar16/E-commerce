import {
  Body,
  Controller,
  Headers,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Roles } from 'src/common/enums/user-roles.enum';
import { RoleGuard } from '../../guards/role.guard';
import { SpecialSignUpDto } from '../dtos/auth.admin-signup.dto';
import { ChangePasswordDto } from '../dtos/auth.change-password.dto';
import { EmailOnlyDto } from '../dtos/auth.email-only.dto';
import { ResetPasswordDto } from '../dtos/auth.reset-password.dto';
import { SignInDto } from '../dtos/auth.signin.dto';
import { SignUpDto } from '../dtos/auth.signup.dto';
import { VerifyEmailDto } from '../dtos/auth.verify-email.dto';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { SignInResponseDto } from '../dtos/signin-response.dto';
import { UserResponseDto } from '../dtos/user-response.dto';
import { AuthGeneralService } from '../providers/auth-general.service';

@ApiTags('Auth')
@Controller('auth')
@ApiBearerAuth()
export class AuthGeneralController {
  constructor(private readonly authGeneralService: AuthGeneralService) {}

  @Post('signup/customer')
  @ApiOkResponse({
    description: 'Customer signup Response',
    type: UserResponseDto,
  })
  @ApiOperation({ summary: 'Customer Signup' })
  async customerSignup(@Body() signUpDto: SignUpDto): Promise<UserResponseDto> {
    const createdUser = this.authGeneralService.customerSignup(signUpDto);
    return plainToInstance(UserResponseDto, createdUser);
  }

  @Post('signup/special')
  @ApiOperation({ summary: 'Admin/Delivery-personnel Signup' })
  @ApiOkResponse({
    description: 'Admin/Delivery-personnel signup Response',
    type: UserResponseDto,
  })
  async specialSignUp(
    @Body() specialSignUpDto: SpecialSignUpDto,
  ): Promise<UserResponseDto> {
    const createdUser = this.authGeneralService.specialSignUp(specialSignUpDto);
    return plainToInstance(UserResponseDto, createdUser);
  }

  @Post('verify-email')
  @ApiOperation({ summary: 'Verify Email' })
  @ApiOkResponse({
    description: 'Email verification Response',
    type: UserResponseDto,
  })
  async verifyEmail(
    @Body() verifyEmailDto: VerifyEmailDto,
  ): Promise<UserResponseDto> {
    const verifiedUser = this.authGeneralService.verifyEmail(verifyEmailDto);
    return plainToInstance(UserResponseDto, verifiedUser);
  }

  @Post('approve-admin')
  @ApiOperation({ summary: 'Approve Admin' })
  @UseGuards(AuthGuard('jwt'), new RoleGuard([Roles.SUPERADMIN]))
  async approveAdmin(@Body() emailOnlyDto: EmailOnlyDto) {
    return this.authGeneralService.approveAdmin(emailOnlyDto);
  }

  @Post('approve-delivery-person')
  @ApiOperation({ summary: 'Approve Delivery Person' })
  @UseGuards(AuthGuard('jwt'), new RoleGuard([Roles.SUPERADMIN, Roles.ADMIN]))
  async approveDeliveryAgent(@Body() emailOnlyDto: EmailOnlyDto) {
    return this.authGeneralService.approveDeliveryAgent(emailOnlyDto);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Signin' })
  @UseGuards(AuthGuard('local'))
  @ApiOkResponse({ description: 'Signin Response', type: SignInResponseDto })
  async signin(
    @Body() signInDto: SignInDto,
    @Req() req: any,
  ): Promise<SignInResponseDto> {
    const { accessToken, refreshToken } = await this.authGeneralService.signIn(
      req.user,
    );
    return plainToInstance(SignInResponseDto, {
      accessToken,
      refreshToken,
      user: plainToInstance(UserResponseDto, req.user),
    });
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout' })
  @UseGuards(AuthGuard('jwt'))
  async logout(@Req() req: any) {
    const accessToken = req.headers['authorization'].split(' ')[1];
    console.log(accessToken);
    return await this.authGeneralService.logout(accessToken);
  }

  // @Post('logout')
  // async logout(@Headers('authorization') authorizationHeader: string): Promise<void> {
  //   const [, accessToken] = authorizationHeader.split(' ');
  //   console.log(accessToken);
  //   this.authGeneralService.logout(accessToken);
  // }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh' })
  @ApiOkResponse({ description: 'Refresh Token', type: SignInResponseDto })
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<SignInResponseDto> {
    const { accessToken, refreshToken, user } =
      await this.authGeneralService.refreshToken(refreshTokenDto.refreshToken);
    return plainToInstance(SignInResponseDto, {
      accessToken,
      refreshToken,
      user: plainToInstance(UserResponseDto, user),
    });
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Forgot Password' })
  async forgotPassword(@Body() emailOnlyDto: EmailOnlyDto): Promise<string> {
    return this.authGeneralService.forgotPassword(emailOnlyDto);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset Password' })
  async resetPassword(
    @Body() resePasswordDto: ResetPasswordDto,
  ): Promise<string> {
    return this.authGeneralService.resetPassword(resePasswordDto);
  }

  @Post('resend-otp')
  @ApiOperation({ summary: 'Resend OTP' })
  async resendOTP(@Body() resendOTPDto: EmailOnlyDto): Promise<string> {
    return this.authGeneralService.resendOTP(resendOTPDto);
  }

  @Post('change-password')
  @ApiOperation({ summary: 'Change Password' })
  @UseGuards(AuthGuard('jwt'))
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: any,
  ): Promise<string> {
    changePasswordDto.email = req.user.email;
    return this.authGeneralService.changePassword(changePasswordDto);
  }
}
