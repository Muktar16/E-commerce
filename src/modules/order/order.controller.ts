import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { Roles } from 'src/utility/common/user-roles.enum';

@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  
  @Post()
  @UseGuards(AuthGuard('jwt') ,new RoleGuard([Roles.USER]))
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: any){
    return this.orderService.create(createOrderDto, +req.user.id);
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
