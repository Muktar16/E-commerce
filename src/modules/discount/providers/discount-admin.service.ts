import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDiscountDto } from '../dto/create-discount.dto';
import { UpdateDiscountDto } from '../dto/update-discount.dto';
import { DiscountEntity } from '../entities/discount.entity';

@Injectable()
export class DiscountAdminService {
  constructor(
    @InjectRepository(DiscountEntity)
    private discountRepository: Repository<DiscountEntity>,
  ) {}

  async create(createDiscountDto: CreateDiscountDto): Promise<DiscountEntity> {
    const discount = this.discountRepository.create(createDiscountDto);
    return this.discountRepository.save(discount);
  }

  async findAll(): Promise<DiscountEntity[]> {
    return this.discountRepository.find();
  }

  async findOne(id: number): Promise<DiscountEntity> {
    const discount = await this.discountRepository.findOne({ where: { id } });
    if (!discount) {
      throw new NotFoundException(`Discount with id ${id} not found`);
    }
    return discount;
  }

  async update(id: number, updateDiscountDto: UpdateDiscountDto): Promise<DiscountEntity> {
    const discount = await this.findOne(id);
    Object.assign(discount, updateDiscountDto);
    return this.discountRepository.save(discount);
  }

  async remove(id: number): Promise<void> {
    const discount = await this.findOne(id);
    await this.discountRepository.softRemove(discount);
  }

  async restore(id: number): Promise<DiscountEntity> {
    const discount = await this.discountRepository.findOne({ where: { id }, withDeleted: true });
    if (!discount) {
      throw new NotFoundException(`Discount with id ${id} not found`);
    }
    await this.discountRepository.restore(id);
    return this.findOne(id);
  }
}
