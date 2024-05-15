import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { ILike, Like, Repository } from 'typeorm';
import { CategoryService } from '../category/category.service';
import { on } from 'events';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    private categoryService: CategoryService,
  ) {}
  async create(createProductDto: CreateProductDto) {
    const productExist = await this.findProductBySku(createProductDto.sku);
    if (productExist) {
      throw new HttpException(
        'Product with this SKU already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    const product = this.productRepository.create(createProductDto);
    product.category = await this.categoryService.findOne(
      createProductDto.categoryId,
    );
    return this.productRepository.save(product);
  }

  async findAll(queryParams: any) {
    const limit = +queryParams.pageSize || 10;
    const page = +queryParams.page || 1;
    const skip = ((page > 1 ? page : 1) - 1) * (limit > 0 ? limit : 1);
    const result = this.productRepository
      .createQueryBuilder('product')
      .select('product')
      .innerJoinAndSelect(
        'product.category',
        'category',
        'category.id = :categoryId',
        { categoryId: queryParams.categoryId },
      )
      .where('product.isDeleted = :isDeleted', { isDeleted: false })
      .andWhere('product.name ILike :name', { name: `%${queryParams.search}%` })
      .orWhere('product.description ILike :description', {
        description: `%${queryParams.search}%`,
      })
      .skip(skip)
      .limit(limit);

    return await result.getMany();
  }

  async findOne(id: number) {
    const product = this.productRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['category'],
    });
    if (!product) {
      throw new HttpException(
        `Product with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new HttpException(
        `Product with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    const updatedProduct = Object.assign(product, updateProductDto);
    return this.updateById(+updatedProduct.id, updatedProduct);
  }

  async updateById(id: number, updateProductDto: any) {
    delete updateProductDto.updatedAt;
    if (updateProductDto.categoryId) {
      updateProductDto.category = await this.categoryService.findOne(
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

  async remove(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new HttpException(
        `Product with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    product.isDeleted = true;
    product.deletedAt = new Date();
    return await this.productRepository.update(+product.id, product);
  }

  async restore(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new HttpException(
        `Product with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    product.isDeleted = false;
    product.deletedAt = null;
    return await this.productRepository.update(+product.id, product);
  }

  async getDeleted() {
    return await this.productRepository.find({
      where: { isDeleted: true },
      relations: ['category'],
    });
  }

  private async findProductBySku(sku: string) {
    return await this.productRepository.findOne({ where: { sku } });
  }
}
