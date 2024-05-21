import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseType } from 'src/common/interfaces/response.interface';
import { ILike, Repository } from 'typeorm';
import { FilterUserDto } from '../dtos/filter-user.dto';
import { PaginationDto } from '../dtos/pagination.dto';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserCrudService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findAll(
    paginationDto: PaginationDto,
    filterUserDto: FilterUserDto,
  ): Promise<ResponseType> {
    console.log('paginationDto', paginationDto);
    console.log('filterUserDto', filterUserDto);
    const { page = 1, limit = 10 } = paginationDto;
    // Constructing the where condition dynamically
    let where: any = { isDeleted: false };
    where = { ...where, ...filterUserDto };
    if (where.name) where.name = ILike(`%${where.name}%`);
    if (where.email) where.email = ILike(`%${where.email}%`);

    console.log('where', where);

    const options: any = {
      where,
      skip: (page - 1) * limit,
      take: limit,
    };

    const [users, total] = await this.userRepository.findAndCount(options);
    return {
      data: {users,total},
      message: 'Users fetched successfully',
    };
  }

  async deleteAccount(id: number): Promise<ResponseType>{
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    await this.userRepository.softDelete(id);
    return { message: 'Account deleted successfully', data: user};
  }

  async findOneById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { id, isDeleted: false},
    });
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

  async updateUser(id: number, user: any) {
    delete user.updatedAt;
    await this.userRepository.update(id, user);
    // this.userRepository.save(user);
    return await this.userRepository.findOne({ where: { id } });
  }

  async findOneByResetToken(token: string) {
    return await this.userRepository.findOne({
      where: { resetPasswordToken: token },
    });
  }

  async getUserWithCart(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { cart: { cartProducts: { product: true } } },
    });
    if (!user || !user.cart) {
      throw new HttpException(
        'User or user cart not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async createUser(user: Partial<UserEntity>): Promise<UserEntity> {
    user = this.userRepository.create(user);
    return await this.userRepository.save(user);
  }
}
