import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePromoDto } from '../dto/create-promo.dto';
import { UpdatePromoDto } from '../dto/update-promo.dto';
import * as moment from 'moment';
import { InjectRepository } from '@nestjs/typeorm';
import { UserPromoEntity } from '../entities/user_promos.entity';
import {
  FindOptionsWhere,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  Repository,
} from 'typeorm';
import { UserCrudService } from 'src/modules/user/providers/user-crud.service';
import { PromoEntity } from '../entities/promo.entity';
import { PromoQueryDto } from '../dto/promo-query.dto';
import { WhereClause } from 'typeorm/query-builder/WhereClause';

@Injectable()
export class PromoService {
  constructor(
    @InjectRepository(UserPromoEntity)
    private userPromoRepository: Repository<UserPromoEntity>,
    @InjectRepository(PromoEntity)
    private promoRepository: Repository<PromoEntity>,
    private userService: UserCrudService,
  ) {}
  async create(createPromoDto: CreatePromoDto) {
    const currentDate = moment();
    const startDate = moment(createPromoDto.startDate);
    const endDate = moment(createPromoDto.endDate);
    // check if the already existing promo with the same code & still not ended
    const existingPromo = await this.promoRepository.findOne({
      where: { code: createPromoDto.code },
    });
    console.log('existingPromo', existingPromo);
    if (existingPromo && endDate.isAfter(currentDate, 'day')) {
      throw new BadRequestException(
        'A promo with the same code already exists & has not ended yet',
      );
    }
    // check if the start date is before the end date && after the current date
    if (!startDate.isBefore(endDate, 'day')) {
      throw new BadRequestException('Start date should be before the end date');
    }
    if (!startDate.isAfter(currentDate, 'day')) {
      throw new BadRequestException(
        'Start date should be after the current date',
      );
    }
    // check if all the users are valid
    if (
      createPromoDto.applicableUsers &&
      createPromoDto.applicableUsers.length > 0
    ) {
      const users = await this.userService.findAllByIds(
        createPromoDto.applicableUsers,
      );
      if (users.length !== createPromoDto.applicableUsers.length) {
        throw new BadRequestException('Invalid user IDs');
      }
    }
    // create a new promo
    const promo = this.promoRepository.create(createPromoDto);
    await this.promoRepository.save(promo);
    console.log('promo', promo);
    // apply the promo to appicable  users by ids
    if (
      createPromoDto.applicableUsers &&
      createPromoDto.applicableUsers.length > 0
    ) {
      // apply the promo to each user
      const users = await this.userService.findAllByIds(
        createPromoDto.applicableUsers,
      );
      for (const user of users) {
        const userPromo = this.userPromoRepository.create({
          user,
          promo,
        });
        await this.userPromoRepository.save(userPromo);
      }
    }
    return 'Promo created successfully';
  }

  async findAll(query: PromoQueryDto): Promise<PromoEntity[]> {
    const currentDate = moment.utc().toDate(); // Get the current date in UTC as a Date object
    let promos: PromoEntity[];

    if (query.status === 'running') {
      promos = await this.promoRepository.find({
        where: [
          {
            startDate: LessThanOrEqual(currentDate),
            endDate: MoreThan(currentDate),
          },
        ],
        relations: { userPromos: { user: true } },
      });
    } else if (query.status === 'ended') {
      promos = await this.promoRepository.find({
        where: [{ endDate: LessThan(currentDate) }],
        relations: { userPromos: { user: true } },
      });
    } else if (query.status === 'not-started') {
      promos = await this.promoRepository.find({
        where: [{ startDate: MoreThan(currentDate) }],
        relations: { userPromos: { user: true } },
      });
    } else {
      promos = await this.promoRepository.find({
        relations: { userPromos: { user: true } },
      });
    }

    return promos;
  }

  async findOne(id: number) {
    return this.promoRepository.findOne({
      where: { id },
      relations: { userPromos: { user: true } },
    });
  }

  async update(id: number, updatePromoDto: UpdatePromoDto): Promise<string> {
    // check if the promo exists
    const promo = await this.promoRepository.findOne({ where: { id } });
    if (!promo) {
      throw new BadRequestException(`Promo with id ${id} not found`);
    }
    const currentDate = moment();
    const startDate = moment(updatePromoDto.startDate);
    const endDate = moment(updatePromoDto.endDate);
    //  check if the start date is before the end date && after the current date
    if (!startDate.isBefore(endDate, 'day')) {
      throw new BadRequestException('Start date should be before the end date');
    }
    if (!startDate.isAfter(currentDate, 'day')) {
      throw new BadRequestException(
        'Start date should be after the current date',
      );
    }
    if (updatePromoDto.applicableUsers) {
      // check if all the users are valid
      if (
        updatePromoDto.applicableUsers &&
        updatePromoDto.applicableUsers.length > 0
      ) {
        const users = await this.userService.findAllByIds(
          updatePromoDto.applicableUsers,
        );
        if (users.length !== updatePromoDto.applicableUsers.length) {
          throw new BadRequestException('Invalid user IDs');
        }
      }
      // remove the promo from all the previous users
      await this.userPromoRepository.delete({ promo });
    }
    // update the promo
    await this.promoRepository.update(id, updatePromoDto);
    // apply the promo to appicable  users by ids
    if (
      updatePromoDto.applicableUsers &&
      updatePromoDto.applicableUsers.length > 0
    ) {
      // apply the promo to each user
      const users = await this.userService.findAllByIds(
        updatePromoDto.applicableUsers,
      );
      for (const user of users) {
        const userPromo = this.userPromoRepository.create({
          user,
          promo,
        });
        await this.userPromoRepository.save(userPromo);
      }
    }
    return 'Promo updated successfully';
  }

  async remove(id: number) {
    // check if the promo exists
    const promo = await this.promoRepository.findOne({ where: { id } });
    if (!promo) {
      throw new BadRequestException(`Promo with id ${id} not found`);
    }
    // remove the promo from all the users
    await this.userPromoRepository.delete({ promo });
    // remove the promo
    await this.promoRepository.delete(id);

    return `Promo '${promo.code}' deleted with id ${id}`;
  }

  async findMyPromos(userId: number) {
    return this.userPromoRepository.find({
      where: { user: { id: userId } },
      relations: { promo: true },
    });
  }

  async findOneConditionally(condition: FindOptionsWhere<PromoEntity>) {
    return this.promoRepository.findOne({ where: condition });
  }
}
