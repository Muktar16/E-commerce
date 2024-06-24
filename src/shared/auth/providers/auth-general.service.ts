import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

import { generate } from 'otp-generator';
import { Roles } from 'src/common/enums/user-roles.enum';
import { CartService } from 'src/modules/cart/providers/cart.service';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { UserCrudService } from 'src/modules/user/providers/user-crud.service';
import { SmsService } from 'src/shared/smssender/sms/sms.service';
import { MailSenderService } from '../../mailsender/mailsender.service';
import { SpecialSignUpDto } from '../dtos/auth.admin-signup.dto';
import { ChangePasswordDto } from '../dtos/auth.change-password.dto';
import { EmailOnlyDto } from '../dtos/auth.email-only.dto';
import { ResetPasswordDto } from '../dtos/auth.reset-password.dto';
import { SignUpDto } from '../dtos/auth.signup.dto';
import { VerifyEmailDto } from '../dtos/auth.verify-email.dto';
import { UserResponseDto } from '../dtos/user-response.dto';
import { In, Repository } from 'typeorm';
import { SessionEntity } from '../entities/sessions.entity';
import { InjectRepository } from '@nestjs/typeorm';

const moment = require('moment');
@Injectable()
export class AuthGeneralService {
  constructor(
    private userCrudService: UserCrudService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailSenderService: MailSenderService,
    private cartService: CartService,
    private smsService: SmsService,
    @InjectRepository(SessionEntity)
    private sessionRepository: Repository<SessionEntity>,
  ) {}

  async customerSignup(signupUserDto: SignUpDto): Promise<UserResponseDto> {
    const userExist = await this.userCrudService.findUserByConditions({
      email: signupUserDto.email,
    });
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
    user.otpCreatedAt = new Date();
    user = await this.userCrudService.updateUser(+user.id, user);

    // Send OTP via SMS
    // const sms = await this.smsService.sendSMS();
    // console.log(sms);
    // Send OTP via email
    try {
      await this.mailSenderService.sendOTP({
        to: user.email,
        subject: `Welcome to NoboShop, ${user.name}!`,
        text: `${user.otp}`,
        user: user,
      });
      return user;
    } catch (error) {
      await this.userCrudService.deleteAccount(+user.id);
      throw new HttpException(
        'Error sending email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async specialSignUp(
    specialSignUpDto: SpecialSignUpDto,
  ): Promise<UserResponseDto> {
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
      text: `Your account will be approved by the Admin or super amdin`,
      user: specialSignUpDto,
    });

    return user;
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const user = await this.userCrudService.findUserByConditions({
      email: verifyEmailDto.email,
    });
    // console.log('user', user);
    if (!user) {
      throw new HttpException('Email Not found', HttpStatus.NOT_FOUND);
    }
    if (user.otp !== verifyEmailDto.otp) {
      throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
    }
    console.log('user.otpCreatedAt', user.otpCreatedAt);
    // const offsetInMilliseconds = new Date().getTimezoneOffset() * 60000;
    const currentTime = moment();
    console.log('currentTime', currentTime);
    const otpCreatedAt = moment(user.otpCreatedAt);
    console.log('otpCreatedAt', otpCreatedAt);
    const minutesSinceCreatedAt = currentTime.diff(otpCreatedAt, 'minutes');
    console.log('minutesSinceCreatedAt', minutesSinceCreatedAt);
    if (
      minutesSinceCreatedAt > this.configService.get<number>('OTP_EXPIRES_IN')
    ) {
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
    const updatedUser = await this.userCrudService.updateUser(+user.id, user);
    return updatedUser;
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
    user.otpCreatedAt = new Date();
    await this.userCrudService.updateUser(+user.id, user);
    this.mailSenderService.sendOTP({
      to: user.email,
      subject: 'Resend OTP',
      text: `OTP is ${user.otp}`,
      user: user,
    });
    return 'OTP sent to your email';
  }

  async signIn(
    userInfo: UserEntity,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = await this.generateToken(userInfo);
    const refreshToken = await this.generateRefreshToken(userInfo);
    // Store the refresh token in the user entity
    userInfo.refreshToken = refreshToken.token;
    userInfo.refreshTokenExpires = refreshToken.expires;
    await this.userCrudService.updateUser(+userInfo.id, userInfo);
    // save session token in the database
    const session = this.sessionRepository.create({
      user: { id: userInfo.id },
      token: accessToken,
    });
    await this.sessionRepository.save(session);
    return { accessToken, refreshToken: refreshToken.token };
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string; user: UserEntity }> {
    console.log(refreshToken);
    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });

    const user = await this.userCrudService.findUserByConditions({
      id: payload.id,
      refreshToken,
    });

    if (!user || user.refreshTokenExpires < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const newAccessToken = await this.generateToken(user);
    const newRefreshToken = await this.generateRefreshToken(user);

    // Update the refresh token in the user entity
    user.refreshToken = newRefreshToken.token;
    user.refreshTokenExpires = newRefreshToken.expires;
    await this.userCrudService.updateUser(+user.id, user);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken.token,
      user,
    };
  }

  async approveAdmin(emailOnlyDto: EmailOnlyDto) {
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
    await this.userCrudService.updateUser(+user.id, user);
    this.mailSenderService.sendAdminApprovedEmail({
      to: user.email,
      subject: 'Admin Approved',
      text: 'You are now an admin',
      user: user,
    });
    return;
  }

  async approveDeliveryAgent(emailOnlyDto: EmailOnlyDto) {
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
    await this.userCrudService.updateUser(+user.id, user);
    this.mailSenderService.sendAdminApprovedEmail({
      to: user.email,
      subject: 'Delivery-Person Approved',
      text: 'You are now a Delivery person',
      user: user,
    });
    return;
  }

  async forgotPassword(emailOnlyDto: EmailOnlyDto): Promise<string> {
    const user = await this.userCrudService.findOneByEmail(emailOnlyDto.email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (!user.isVerified) {
      throw new HttpException('User not verified', HttpStatus.BAD_REQUEST);
    }
    const resetToken = randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPassTokenExpires = new Date(Date.now() + 3600000);
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

    return 'Reset password instructions sent to your email';
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<string> {
    const user = await this.userCrudService.findUserByConditions({
      resetPasswordToken: resetPasswordDto.token,
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (!user.isVerified) {
      throw new HttpException('User not verified', HttpStatus.BAD_REQUEST);
    }
    if (user.resetPasswordToken !== resetPasswordDto.token) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }
    if (new Date() > user.resetPassTokenExpires) {
      throw new HttpException('Token expired', HttpStatus.BAD_REQUEST);
    }
    user.password = await bcrypt.hash(resetPasswordDto.newPassword, 10);
    user.resetPasswordToken = null;
    user.resetPassTokenExpires = null;
    await this.userCrudService.updateUser(+user.id, user);
    return 'Password reset successfully';
  }

  async changePassword(changePasswordDto: ChangePasswordDto): Promise<string> {
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
    return 'Password changed successfully';
  }

  async logout(token: string) {
    await this.sessionRepository.delete({ token });
    return 'Logged out successfully';
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
        issuer: 'noboshop.brainstation-23.com',
        secret: this.configService.get<string>('JWT_SECRET'),
      },
    );
  }

  private async generateRefreshToken(
    user: UserEntity,
  ): Promise<{ token: string; expires: Date }> {
    const expiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'); // e.g., '10d'
    const token = await this.jwtService.signAsync(
      {
        id: user.id,
      },
      {
        expiresIn,
        issuer: 'noboshop.brainstation-23.com',
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      },
    );
    const expires = new Date();
    expires.setDate(expires.getDate() + parseInt(expiresIn, 10)); // Handling '10d' as 10 days
    return { token, expires };
  }
}
