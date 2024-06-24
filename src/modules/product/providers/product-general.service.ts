import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, ILike, In, Repository } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';
import { FilterProductDto } from '../dtos/filter-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { CategoryGeneralService } from 'src/modules/category/providers/category-general.service';

@Injectable()
export class ProductGeneralService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    private categorGeneralService: CategoryGeneralService,
  ) {}

  async findAll(
    filterProductDto: FilterProductDto,
    paginationDto: PaginationDto,
  ) {
    const { page = 1, limit = 10 } = paginationDto;
    const { name, sku, categoryId, search, description } = filterProductDto;
    console.log('data received', filterProductDto, paginationDto);
    let where: any = [];

    if (search) {
      // If search is present, use OR condition for search filters
      where = [
        { name: ILike(`%${search}%`) },
        { sku: ILike(`%${search}%`) },
        { description: ILike(`%${search}%`) },
        { category: { name: ILike(`%${search}%`) } },
        { category: { description: ILike(`%${search}%`) } },
      ];
    } else {
      // If search is not present, use AND condition for other filters
      if (name || sku || description || categoryId) {
        where.push({
          ...(name && { name: ILike(`%${name}%`) }),
          ...(sku && { sku: ILike(`%${sku}%`) }),
          ...(description && { description: ILike(`%${description}%`) }),
          ...(categoryId && { category: { id: categoryId } }),
        });
      }
    }

    const options: FindManyOptions<ProductEntity> = {
      where: where.length ? where : undefined,
      relations: { category: true, discount: true },
      skip: (page - 1) * limit,
      take: limit,
    };

    const [products, total] =
      await this.productRepository.findAndCount(options);
    return { products, total };
  }

  async findOne(id: number) {
    const product = this.productRepository.findOne({
      where: { id },
      relations: { category: true, discount: true },
    });
    if (!product) {
      throw new HttpException(
        `Product with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return product;
  }

  async updateById(id: number, updateProductDto: any) {
    delete updateProductDto.updatedAt;
    if (updateProductDto.categoryId) {
      updateProductDto.category = await this.categorGeneralService.findOne(
        updateProductDto.categoryId,
      );
      delete updateProductDto.categoryId;
    }
    await this.productRepository.update(id, updateProductDto);
    return await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });
  }

  async findProductBySku(sku: string) {
    return await this.productRepository.findOne({ where: { sku } });
  }

  async findAllByIds(ids: number[]) {
    return await this.productRepository.findBy({ id: In(ids) });
  }
}
