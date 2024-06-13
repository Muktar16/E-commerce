import {
    Body,
    Param,
    Put,
    UseGuards
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
import { UpdateStatusDto } from '../dtos/update-status.dto';
import { AdminOrderService } from '../providers/admin-order.service';

@ApiTags('Deliveryman/Order')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), new RoleGuard([Roles.DELIVERYPERSON]))
// @Controller('delivery-man/orders')
export class AdminOrderController {
  constructor(private readonly adminOrderService: AdminOrderService) {}

  @ApiOperation({ summary: 'Update order status' })
  @ApiOkResponse({
    description: 'Order status updated successfully',
    type: CreateOrderResponseDto,
  })
  @Put('change-status/:id')
  update(@Body() updateStatusDto: UpdateStatusDto, @Param('id') id: string) {
    return this.adminOrderService.updateOrderStatus(+id, updateStatusDto);
  }
}
