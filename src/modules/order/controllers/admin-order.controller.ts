import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { Roles } from 'src/common/enums/user-roles.enum';
import { AdminOrderService } from '../providers/admin-order.service';
import { UpdateStatusDto } from '../dtos/update-status.dto';
import { ResponseType } from 'src/common/interfaces/response.interface';

@ApiTags('Order/Admin')
@ApiBearerAuth()
@ApiBearerAuth()
@Controller('order')
export class AdminOrderController {
  constructor(private readonly adminOrderService: AdminOrderService) {}

  @UseGuards(
    AuthGuard('jwt'),
    new RoleGuard([Roles.ADMIN, Roles.SUPERADMIN, Roles.DELIVERYPERSON]),
  )
  @Put('update-status/:id')
  update(
    @Body() updateStatusDto: UpdateStatusDto,
    @Param('id') id: string,
  ): Promise<ResponseType> {
    return this.adminOrderService.updateOrderStatus(+id, updateStatusDto);
  }

  @UseGuards(AuthGuard('jwt'), new RoleGuard([Roles.ADMIN, Roles.SUPERADMIN]))
  @Delete(':id')
  deleteOrder(@Param('id') id: string): Promise<ResponseType> {
    return this.adminOrderService.deleteOrder(+id);
  }

  @UseGuards(AuthGuard('jwt'), new RoleGuard([Roles.ADMIN, Roles.SUPERADMIN]))
  @Get()
  getAllOrders(@Query() query: any): Promise<ResponseType> {
    return this.adminOrderService.getAllOrders(query);
  }
}
