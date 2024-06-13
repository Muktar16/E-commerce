import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { Roles } from 'src/common/enums/user-roles.enum';
import { AdminOrderService } from '../providers/admin-order.service';
import { UpdateStatusDto } from '../dtos/update-status.dto';
import { ResponseType } from 'src/common/interfaces/response.interface';
import { CreateOrderResponseDto } from '../dtos/create-order-response.dto';
import { GetAllOrdersQueryDto } from '../dtos/get-all-orders-query.dto';

@ApiTags('Admin/Order')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), new RoleGuard([Roles.ADMIN, Roles.SUPERADMIN]))
@Controller('admin/orders')
export class AdminOrderController {
  constructor(private readonly adminOrderService: AdminOrderService) {}

  @ApiOperation({ summary: 'Update order status' })
  @ApiOkResponse({ description: 'Order status updated successfully', type: CreateOrderResponseDto })
  @Put('update-status/:id')
  update(
    @Body() updateStatusDto: UpdateStatusDto,
    @Param('id') id: string,
  ) {
    return this.adminOrderService.updateOrderStatus(+id, updateStatusDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete order' })
  @ApiOkResponse({ description: 'Order deleted successfully', type: String })
  async deleteOrder(@Param('id') id: string): Promise<string> {
     return this.adminOrderService.deleteOrder(+id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  @ApiOkResponse({ description: 'List of all orders', type: [CreateOrderResponseDto] })
  async getAllOrders() {
    return this.adminOrderService.getAllOrders({});
  }

  // @Get()
  // @ApiOperation({ summary: 'Get all orders' })
  // @ApiOkResponse({ description: 'List of all orders', type: [CreateOrderResponseDto] })
  // async getAllOrders(@Query() query: GetAllOrdersQueryDto) {
  //   return this.adminOrderService.getAllOrders(query);
  // }
}
