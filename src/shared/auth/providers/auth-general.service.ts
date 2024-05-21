import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import { generate } from 'otp-generator';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { MailSenderService } from '../../mailsender/mailsender.service';
import { EmailOnlyDto } from '../dto/auth.email-only.dto';
import { SignUpDto } from '../dto/auth.signup.dto';
import { VerifyEmailDto } from '../dto/auth.verify-email.dto';
import { ChangePasswordDto } from '../dto/auth.change-password.dto';
import { randomBytes } from 'crypto';
import { ResetPasswordDto } from '../dto/auth.reset-password.dto';
import { Roles } from 'src/common/enums/user-roles.enum';
import { CartService } from 'src/modules/cart/providers/cart.service';
import { ResponseType } from 'src/common/interfaces/response.interface';
import { UserCrudService } from 'src/modules/user/providers/user-crud.service';
import { SpecialSignUpDto } from '../dto/auth.admin-signup.dto';

@Injectable()
export class AuthGeneralService {
  constructor(
    private userCrudService: UserCrudService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailSenderService: MailSenderService,
    private cartService: CartService,
  ) {}

  async signUp(signupUserDto: SignUpDto): Promise<ResponseType> {
    const userExist = await this.userCrudService.findOneByEmail(
      signupUserDto.email,
    );
    if (userExist) {
      throw new BadRequestException('User already exists');
    }
    signupUserDto.password = await bcrypt.hash(signupUserDto.password, 10);
    let user = await this.userCrudService.createUser(signupUserDto);
    user.otp = generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    user = await this.userCrudService.updateUser(+user.id, user);
    // Send OTP via email
    this.mailSenderService.sendOTP({
      to: user.email,
      subject: `Welcome to NoboShop, ${user.name}!`,
      text: `${user.otp}`,
      user: user,
    });
    user.otpCreatedAt = new Date();
    return {
      data: user,
      message: `OTP sent to your email valid for ${this.configService.get('OTP_EXPIRES_IN')} minutes`,
    };
  }

  async verifyEmail(
    verifyEmailDto: VerifyEmailDto,
  ): Promise<{ user: UserEntity; message: string }> {
    const user = await this.userCrudService.findOneByEmail(
      verifyEmailDto.email,
    );
    if (!user) {
      throw new HttpException('Email Not found', HttpStatus.NOT_FOUND);
    }
    if (user.otp !== verifyEmailDto.otp) {
      throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
    }

    // const offsetInMilliseconds = new Date().getTimezoneOffset() * 60000;
    const currentTime = moment();
    const otpCreatedAt = moment(user.otpCreatedAt);
    const minutesSinceUpdatedAt = currentTime.diff(otpCreatedAt, 'minutes');

    if (minutesSinceUpdatedAt > this.configService.get('OTP_EXPIRES_IN')) {
      throw new HttpException(
        `OTP expired. Please enter the otp within ${this.configService.get('OTP_EXPIRES_IN')}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    user.isVerified = true;
    user.otp = null;
    user.otpCreatedAt = null;
    // Create cart for user
    if (user.role === Roles.USER) {
      this.cartService.createCart({ userId: user.id });
    }
    let updatedUser = await this.userCrudService.updateUser(+user.id, user);
    return { user: updatedUser, message: 'User verified successfully' };
  }

  async resendOTP(emailOnlyDto: EmailOnlyDto): Promise<string> {
    const user = await this.userCrudService.findOneByEmail(emailOnlyDto.email);
    if (!user) {
      throw new HttpException('Email Not found', HttpStatus.NOT_FOUND);
    }
    if (user.isVerified) {
      throw new HttpException('User already verified', HttpStatus.BAD_REQUEST);
    }
    if (user.role !== 'user') {
      throw new HttpException(
        'Only normal user can request for OTP',
        HttpStatus.BAD_REQUEST,
      );
    }
    user.otp = generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    await this.userCrudService.updateUser(+user.id, user);
    this.mailSenderService.sendOTP({
      to: user.email,
      subject: 'Resend OTP',
      text: `OTP is ${user.otp}`,
      user: user,
    });
    return 'OTP sent to your email';
  }

  async specialSignUp(
    specialSignUpDto: SpecialSignUpDto,
  ): Promise<{ user: any; message: string }> {
    const userExist = await this.userCrudService.findOneByEmail(
      specialSignUpDto.email,
    );
    if (userExist) {
      throw new BadRequestException('User already exists');
    }
    specialSignUpDto.password = await bcrypt.hash(
      specialSignUpDto.password,
      10,
    );
    const user = await this.userCrudService.createUser(specialSignUpDto);
    this.mailSenderService.sendSuperAdminWillApproveEmail({
      to: specialSignUpDto.email,
      subject: 'Waiting for approval at EasyMart Admin Panel',
      text: `Your account will be approved by the super admin`,
      user: specialSignUpDto,
    });
    return {
      user,
      message: 'Your account will be approved by the super admin',
    };
  }

  async approveAdmin(emailOnlyDto: EmailOnlyDto): Promise<ResponseType> {
    const user = await this.userCrudService.findOneByEmail(emailOnlyDto.email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (user.isVerified) {
      throw new HttpException(
        'User already approved or this email already have a user account.',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (user.role !== Roles.ADMIN) {
      throw new HttpException(
        'This is not an admin account',
        HttpStatus.BAD_REQUEST,
      );
    }
    user.isVerified = true;
    const updatedUser = await this.userCrudService.updateUser(+user.id, user);
    return {
      data: { user: updatedUser },
      message: 'Admin approved successfully',
    };
  }

  async approveDeliveryAgent(
    emailOnlyDto: EmailOnlyDto,
  ): Promise<ResponseType> {
    const user = await this.userCrudService.findOneByEmail(emailOnlyDto.email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (user.isVerified) {
      throw new HttpException(
        'This delivery-agent already approved or this email already have a user account.',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (user.role !== Roles.DELIVERYPERSON) {
      throw new HttpException(
        'This is not a delivery-person account',
        HttpStatus.BAD_REQUEST,
      );
    }
    user.isVerified = true;
    const updatedUser = await this.userCrudService.updateUser(+user.id, user);
    return {
      data: { user: updatedUser },
      message: 'Delivery agent approved successfully',
    };
  }

  async signIn(userInfo: UserEntity): Promise<ResponseType> {
    const token = await this.generateToken(userInfo);
    return {
      data: { accessToken: token, user: userInfo },
      message: 'Login successful',
    };
  }

  async changePassword(
    changePasswordDto: ChangePasswordDto,
  ): Promise<ResponseType> {
    const user = await this.userCrudService.getUserWithPassword(
      changePasswordDto.email,
    );
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (!user.isVerified) {
      throw new HttpException('User not verified', HttpStatus.BAD_REQUEST);
    }
    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
    }
    user.password = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await this.userCrudService.updateUser(+user.id, user);
    return { message: 'Password changed successfully', data: null };
  }

  async forgotPassword(emailOnlyDto: EmailOnlyDto): Promise<ResponseType> {
    const user = await this.userCrudService.findOneByEmail(emailOnlyDto.email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (!user.isVerified) {
      throw new HttpException('User not verified', HttpStatus.BAD_REQUEST);
    }
    const resetToken = randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.tokenExpiry = new Date(Date.now() + 3600000);
    await this.userCrudService.updateUser(+user.id, user);

    // Construct the reset password URL
    const resetPasswordUrl = `${this.configService.get('ORIGIN')}/reset-password?token=${resetToken}`;

    // Send the reset password URL in the email
    this.mailSenderService.sendResetPasswordEmail({
      to: user.email,
      subject: 'Forgot Password',
      text: `${resetPasswordUrl}`,
      user: user,
    });

    return {
      message: 'Reset password instructions sent to your email',
      data: null,
    };
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<ResponseType> {
    const user = await this.userCrudService.findOneByResetToken(
      resetPasswordDto.token,
    );
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (!user.isVerified) {
      throw new HttpException('User not verified', HttpStatus.BAD_REQUEST);
    }
    if (user.resetPasswordToken !== resetPasswordDto.token) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }
    if (new Date() > user.tokenExpiry) {
      throw new HttpException('Token expired', HttpStatus.BAD_REQUEST);
    }
    user.password = await bcrypt.hash(resetPasswordDto.newPassword, 10);
    user.resetPasswordToken = null;
    user.tokenExpiry = null;
    await this.userCrudService.updateUser(+user.id, user);
    return { message: 'Password reset successfully', data: null };
  }

  private generateToken(user: UserEntity): Promise<string> {
    return this.jwtService.signAsync(
      {
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
      },
      {
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
        issuer: 'brainstation-23',
        secret: this.configService.get<string>('JWT_SECRET'),
      },
    );
  }
}
