import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
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

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({where: {isDeleted: false}});
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id, isDeleted:false } });
    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }else{
      return category;
    }
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new HttpException(`Category with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }
    delete category.updatedAt;
    const updatedCategory = Object.assign(category, updateCategoryDto);
    return this.categoryRepository.save(updatedCategory);
  }

  async remove(id: number): Promise<void> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    category.isDeleted = true;
    category.deletedAt = new Date();
    await this.categoryRepository.update(+category.id, category);
  }

  async restore(id: number): Promise<string> {
    const category = await this.categoryRepository.findOne({ where: { id, isDeleted:true } });
    if (!category) {
      throw new HttpException('Category not found in deleted category list', HttpStatus.NOT_FOUND);
    }
    category.isDeleted = false;
    category.deletedAt = null;
    await this.categoryRepository.update(+category.id, category);
    return "Category restored successfully"
  }

  async getItems(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id, isDeleted:false }, relations: ['products']});
    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    category.products = category.products.filter(product => !product.isDeleted);
    return category;
  }
}
