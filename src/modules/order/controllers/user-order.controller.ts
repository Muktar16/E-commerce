import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { Roles } from 'src/common/enums/user-roles.enum';
import { ResponseType } from 'src/common/interfaces/response.interface';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UserOrderService } from '../providers/user-order.service';

@ApiTags('Order/User')
@ApiBearerAuth()
@Controller('order')
@UseGuards(AuthGuard('jwt') ,new RoleGuard([Roles.USER]))
export class UserOrderController {
  constructor(private readonly userOrderService: UserOrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: any):Promise<ResponseType>{
    return this.userOrderService.create(createOrderDto, +req.user.id);
  }

  @Get('/cancel/:id')
  cancelOrder(@Param('id') id:string): Promise<ResponseType>{
    return this.userOrderService.cancelOrder(+id);
  }

  @Get('/history')
  findOrderHistory(@Req() req: any): Promise<ResponseType>{
    return this.userOrderService.findOrderHistory(+req.user.id);
  }

  @Get(':id')
  findOneById(@Param('id') id: string) {
    return this.userOrderService.findOneById(+id);
  }
}
