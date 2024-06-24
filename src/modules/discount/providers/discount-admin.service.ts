import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { ProductGeneralService } from 'src/modules/product/providers/product-general.service';
import { Repository } from 'typeorm';
import { ApplyDiscountDto } from '../dto/apply-discount.dto';
import { CreateDiscountDto } from '../dto/create-discount.dto';
import { UpdateDiscountDto } from '../dto/update-discount.dto';
import { DiscountEntity } from '../entities/discount.entity';

@Injectable()
export class DiscountAdminService {
  constructor(
    @InjectRepository(DiscountEntity)
    private discountRepository: Repository<DiscountEntity>,
    private productService: ProductGeneralService,
  ) {}

  async create(createDiscountDto: CreateDiscountDto): Promise<DiscountEntity> {
    // check if the validFrom date is before the validTo date && after the current date
    const currentDate = moment();
    const validFrom = moment(createDiscountDto.validFrom);
    const validTo = moment(createDiscountDto.validTo);
    if (!validFrom.isBefore(validTo, 'day')) {
      throw new BadRequestException(
        'validFrom date should be before the validTo date',
      );
    }
    if (!validFrom.isAfter(currentDate, 'day')) {
      throw new BadRequestException(
        'validFrom date should be after the current date',
      );
    }
    // check if the productids are valid & apply the discount to the products
    if (
      createDiscountDto.productIds &&
      createDiscountDto.productIds.length > 0
    ) {
      const products = await this.productService.findAllByIds(
        createDiscountDto.productIds,
      );
      if (products.length !== createDiscountDto.productIds.length) {
        throw new BadRequestException('Invalid product IDs');
      }
    }
    // Create the discount entity
    const discount = this.discountRepository.create(createDiscountDto);
    await this.discountRepository.save(discount);
    if (
      createDiscountDto.productIds &&
      createDiscountDto.productIds.length > 0
    ) {
      const products = await this.productService.findAllByIds(
        createDiscountDto.productIds,
      );
      for (const product of products) {
        product.discount = discount;
        await this.productService.updateById(product.id, product);
      }
    }
    return discount;
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

  async update(
    id: number,
    updateDiscountDto: UpdateDiscountDto,
  ): Promise<DiscountEntity> {
    const discount = await this.findOne(id);
    Object.assign(discount, updateDiscountDto);
    return this.discountRepository.save(discount);
  }

  async remove(id: number): Promise<string> {
    const discount = await this.findOne(id);
    await this.discountRepository.softRemove(discount);
    return `Discount with id ${id} deleted successfully`;
  }

  async restore(id: number): Promise<DiscountEntity> {
    const discount = await this.discountRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!discount) {
      throw new NotFoundException(`Discount with id ${id} not found`);
    }
    await this.discountRepository.restore(id);
    return this.findOne(id);
  }

  async applyDiscountToProducts(
    applyDiscountDto: ApplyDiscountDto,
  ): Promise<DiscountEntity> {
    const discount = await this.discountRepository.findOne({
      where: { id: applyDiscountDto.discountId },
    });
    if (!discount) {
      throw new NotFoundException(
        `Discount with id ${applyDiscountDto.discountId} not found`,
      );
    }
    const products = await this.productService.findAllByIds(
      applyDiscountDto.productIds,
    );
    // check if any of the products are not found
    if (products.length !== applyDiscountDto.productIds.length) {
      throw new BadRequestException('Invalid product IDs');
    }
    for (const product of products) {
      product.discount = discount;
      await this.productService.updateById(product.id, product);
    }
    const updatedDiscount = await this.discountRepository.findOne({
      where: { id: applyDiscountDto.discountId },
      relations: { products: true },
    });
    return updatedDiscount;
  }
}
