import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from '../dtos/create-product.dto';
import { ProductEntity } from '../entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductGeneralService } from './product-general.service';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { CategoryGeneralService } from 'src/modules/category/providers/category-general.service';

@Injectable()
export class ProductAdminService {
  constructor(
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>,
    private categoryGeneralService: CategoryGeneralService,
    private productGeneralService: ProductGeneralService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const productExist = await this.productGeneralService.findProductBySku(
      createProductDto.sku,
    );
    if (productExist) {
      throw new HttpException(
        'Product with this SKU already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    const product = this.productRepository.create(createProductDto);
    product.category = await this.categoryGeneralService.findOne(
      createProductDto.categoryId,
    );
    return this.productRepository.save(product);
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
    return this.productGeneralService.updateById(
      +updatedProduct.id,
      updatedProduct,
    );
  }

  async delete(id: number) {
    return await this.productRepository.softDelete(+id);
  }

  async restore(id: number) {
    return await this.productRepository.restore(+id);
  }
}
