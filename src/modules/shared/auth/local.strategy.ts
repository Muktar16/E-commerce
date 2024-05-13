import {
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as bcrypt from 'bcrypt';
import { Strategy } from 'passport-local';
import { UserEntity } from 'src/modules/v1/user/entities/user.entity';
import { UserService } from 'src/modules/v1/user/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({ usernameField: 'email', passwordField: 'password'});
  }

  
  async validate(email: string, password: string): Promise<UserEntity> {
    console.log('email', email, password);
    const user = await this.userService.getUserWithPassword(email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (!user.isVerified) {
      throw new HttpException('User not verified', HttpStatus.UNAUTHORIZED);
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid credential!');
    }
    delete user.password;
    delete user.otp;
    return user;
  }
}
