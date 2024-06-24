import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/common/enums/user-roles.enum';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { CreateOrderResponseDto } from '../dtos/create-order-response.dto';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { UserOrderService } from '../providers/user-order.service';

@ApiTags('Order')
@ApiBearerAuth()
@Controller('orders')
@UseGuards(AuthGuard('jwt'), new RoleGuard([Roles.USER]))
export class UserOrderController {
  constructor(private readonly userOrderService: UserOrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create order' })
  @ApiOkResponse({
    description: 'Order created successfully',
    type: CreateOrderResponseDto,
  })
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: any) {
    return this.userOrderService.create(createOrderDto, +req.user.id);
    // return plainToInstance(CreateOrderResponseDto, res);
  }

  @Delete('/cancel/:id')
  @ApiOperation({ summary: 'Cancel order' })
  @ApiOkResponse({
    description: 'Order cancelled successfully',
    type: CreateOrderResponseDto,
  })
  cancelOrder(@Param('id') id: string, @Req() req: any) {
    return this.userOrderService.cancelOrder(+id, +req.user.id);
  }

  @Get('/history')
  @ApiOperation({ summary: 'Order history' })
  @ApiOkResponse({
    description: 'Order history',
    type: [CreateOrderResponseDto],
  })
  findOrderHistory(@Req() req: any) {
    return this.userOrderService.findOrderHistory(+req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find order by id' })
  @ApiOkResponse({
    description: 'Order found successfully',
    type: CreateOrderResponseDto,
  })
  findOneById(@Param('id') id: string, @Req() req: any) {
    return this.userOrderService.findOneById(+id, +req.user.id);
  }
}
