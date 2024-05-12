import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { SignupUserDto } from './dto/signup-user.dto';
import * as bcrypt from 'bcrypt';
import { SigninUserDto } from './dto/signin-user.dto';
import { JwtService } from '@nestjs/jwt';
import { generate } from 'otp-generator';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
    // private readonly emailService: EmailService,
  ) {}

  async signup(signupUserDto: SignupUserDto): Promise<UserEntity> {
    const userExist = await this.findByEmail(signupUserDto.email);
    if (userExist) {
      throw new BadRequestException('User already exists');
    }
    signupUserDto.password = await bcrypt.hash(signupUserDto.password, 10);
    let user = this.userRepository.create(signupUserDto);
    user = await this.userRepository.save(user);
    user.otp = generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    await this.userRepository.update(+user.id, user);
    // Send OTP via email
    // await this.emailService.sendOTP(signupUserDto.email, user.otp);
    delete user.password;
    return user;
  }

  async signin(
    signinUserDto: SigninUserDto,
  ): Promise<{ accessToken: string; user: UserEntity }> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: signinUserDto.email })
      .getOne();
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (!user.isVerified) {
      throw new HttpException('User not verified', HttpStatus.UNAUTHORIZED);
    }
    const isPasswordMatch = await bcrypt.compare(
      signinUserDto.password,
      user.password,
    );
    if (!isPasswordMatch) {
      throw new BadRequestException('Invalid credential!');
    }
    delete user.password;
    const token = await this.generateToken(user);
    return { accessToken: token, user };
  }

  private generateToken(user: UserEntity) {
    return this.jwtService.signAsync(
      { id: user.id, email: user.email },
      {
        expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
        issuer: 'brainstation-23',
        secret: this.configService.get<string>('JWT_SECRET'),
      },
    );
  }

  async findAll():Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findOneById(id: number):Promise<UserEntity> {
    const user =  await this.userRepository.findOne({where: {id}});
    if(!user){
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async findOne(id: number):Promise<UserEntity> {
    return await this.userRepository.findOne({where: {id}});
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }
}
