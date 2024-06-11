import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Roles } from 'src/common/enums/user-roles.enum';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { CreateDiscountDto } from '../dto/create-discount.dto';
import { DiscountResponseDto } from '../dto/discount-response.dto';
import { UpdateDiscountDto } from '../dto/update-discount.dto';
import { DiscountAdminService } from '../providers/discount-admin.service';
import { ApplyDiscountDto } from '../dto/apply-discount.dto';
import { DiscountEntity } from '../entities/discount.entity';

@ApiTags('Admin/Discounts')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), new RoleGuard([Roles.ADMIN, Roles.SUPERADMIN]))
@Controller('admin/discounts')
export class DiscountAdminController {
  constructor(private readonly discountAdminService: DiscountAdminService) {}

  @Post()
  @ApiOperation({ summary: 'Create discount' })
  @ApiOkResponse({ status: 201, type: DiscountResponseDto })
  async create(
    @Body() createDiscountDto: CreateDiscountDto,
  ): Promise<DiscountResponseDto> {
    console.log('createDiscountDto', createDiscountDto);
    const discount = await this.discountAdminService.create(createDiscountDto);
    return plainToInstance(DiscountResponseDto, discount);
  }

  @Get()
  @ApiOperation({ summary: 'Get all discounts' })
  @ApiOkResponse({ status: 200, type: [DiscountResponseDto] })
  async findAll(): Promise<DiscountResponseDto[]> {
    const discounts = await this.discountAdminService.findAll();
    return plainToInstance(DiscountResponseDto, discounts);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get discount by ID' })
  @ApiOkResponse({ status: 200, type: DiscountResponseDto })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DiscountResponseDto> {
    const discount = await this.discountAdminService.findOne(id);
    return plainToInstance(DiscountResponseDto, discount);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update discount' })
  @ApiOkResponse({ status: 200, type: DiscountResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDiscountDto: UpdateDiscountDto,
  ): Promise<DiscountResponseDto> {
    const updatedDiscount = await this.discountAdminService.update(
      id,
      updateDiscountDto,
    );
    return plainToInstance(DiscountResponseDto, updatedDiscount);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete discount' })
  @ApiOkResponse({ type: String, description: 'Discount deleted'})
  async remove(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.discountAdminService.remove(id);
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Restore discount' })
  @ApiOkResponse({ status: 200, type: DiscountResponseDto })
  async restore(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DiscountResponseDto> {
    const restoredDiscount = await this.discountAdminService.restore(id);
    return plainToInstance(DiscountResponseDto, restoredDiscount);
  }

  // route to apply discount to products
  @Post('/apply')
  @ApiOperation({ summary: 'Apply discount to products' })
  @ApiOkResponse({ status: 200, type: String })
  async applyDiscount(@Body() applyDiscountDto:ApplyDiscountDto): Promise<DiscountEntity> {
    return this.discountAdminService.applyDiscountToProducts(applyDiscountDto);
  }
}
