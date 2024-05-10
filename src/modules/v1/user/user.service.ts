import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { SignupUserDto } from './dto/signup-user.dto';
import { hash } from 'bcrypt';
import { SigninUserDto } from './dto/signin-user.dto';

@Injectable()
export class UserService {
  
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async signup(signupUserDto: SignupUserDto):Promise<UserEntity> {
    const userExist = await this.findByEmail(signupUserDto.email);
    if (userExist) {
      throw new BadRequestException('User already exists');
    }
    signupUserDto.password = await hash(signupUserDto.password,10);
    let user = this.userRepository.create(signupUserDto);
    user = await this.userRepository.save(user);
    delete user.password;
    return user;
  }

  async signin(signinUserDto: SigninUserDto):Promise<UserEntity> {
    const user = await this.findByEmail(signinUserDto.email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isPasswordMatch = await compare(signinUserDto.password, user.password);
    if (!isPasswordMatch) {
      throw new BadRequestException('Invalid credential');
    }
    delete user.password;
    return user;
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({email});
  }
}
