import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';
import { CreateBulkCategoriesDto } from '../dtos/create-bulk-category.dto';

@Injectable()
export class CategoryAdminService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      const newCategory = this.categoryRepository.create(createCategoryDto);
      return await this.categoryRepository.save(newCategory);
    } catch (error) {
      if (error.code === '23505' || error.detail.includes('already exists')) {
        throw new ConflictException('Category name must be unique');
      } else {
        throw error;
      }
    }
  }

  async createBulk(
    createBulkCategoriesDto: CreateBulkCategoriesDto,
  ): Promise<Category[]> {
    const categories = this.categoryRepository.create(
      createBulkCategoriesDto.categories,
    );
    return this.categoryRepository.save(categories);
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new HttpException(
        `Category with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    delete category.updatedAt;
    const updatedCategory = Object.assign(category, updateCategoryDto);
    await this.categoryRepository.update(id, updatedCategory);
    return updatedCategory;
  }

  async delete(id: number) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    await this.categoryRepository.softDelete(+category.id);
    return 'Category deleted successfully';
  }

  async restore(id: number): Promise<string> {
    const isExist = await this.categoryRepository.findOne({ where: { id } });
    if (isExist) {
      throw new HttpException('Category is not deleted', HttpStatus.NOT_FOUND);
    }
    await this.categoryRepository.restore({ id });
    return 'Category restored successfully';
  }

  async getItems(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    return category;
  }
}
