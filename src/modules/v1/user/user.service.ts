import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findOneById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async findOneByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });
  }

  async getUserWithPassword(email: string) {
    return await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async createUser(user: Partial<UserEntity>): Promise<UserEntity> {
    user = this.userRepository.create(user);
    return await this.userRepository.save(user);
  }

  async updateUser(id: number, user: any) {
    await this.userRepository.update(id, user);
    return await this.userRepository.findOne({ where: { id } });
  }
}
