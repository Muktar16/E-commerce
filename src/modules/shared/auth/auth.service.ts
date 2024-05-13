import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UserService } from 'src/modules/v1/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from 'src/modules/v1/user/entities/user.entity';
import { SignUpDto } from './dto/auth.signup.dto';
import { generate } from 'otp-generator';

@Injectable()
export class AuthService {

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(signupUserDto: SignUpDto): Promise<UserEntity> {
    const userExist = await this.userService.findOneByEmail(signupUserDto.email);
    if (userExist) {
      throw new BadRequestException('User already exists');
    }
    signupUserDto.password = await bcrypt.hash(signupUserDto.password, 10);
    let user = await this.userService.createUser(signupUserDto);
    user.otp = generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    user = await this.userService.updateUser(+user.id, user);
    // Send OTP via email
    // await this.emailService.sendOTP(signupUserDto.email, user.otp);
    return user;
  }


  async signIn(userInfo: UserEntity): Promise<any> {
    const token = await this.generateToken(userInfo);
    return { accessToken: token, user:userInfo };
  }


  private generateToken(user:UserEntity): Promise<string> {
    return this.jwtService.signAsync(
      { id:user.id, email:user.email, phoneNumber:user.phoneNumber, role:user.role },
      {
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
        issuer: 'brainstation-23',
        secret: this.configService.get<string>('JWT_SECRET'),
      },
    );
  }

}

