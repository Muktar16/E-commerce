import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
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
    return this.categoryRepository.find();
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
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
    const updatedCategory = Object.assign(category, updateCategoryDto);
    return this.categoryRepository.save(updatedCategory);
  }

  async remove(id: number): Promise<void> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    console.log('category', category);
    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    await this.categoryRepository.remove(category);
  }
}
