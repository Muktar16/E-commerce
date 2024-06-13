import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseType } from 'src/common/interfaces/response.interface';
import { Repository } from 'typeorm';
import { UpdateStatusDto } from '../dtos/update-status.dto';
import { OrderEntity } from '../entities/order.entity';

@Injectable()
export class AdminOrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
  ) {}

  async updateOrderStatus(
    id: number,
    updateStatus: UpdateStatusDto,
  ): Promise<ResponseType> {
    const order = await this.orderRepository.findOne({
      where: { id,  },
    });
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    order.orderStatus = updateStatus.status;
    await this.orderRepository.save(order);
    return {
      data: null,
      message: 'Order status updated successfully',
    };
  }
}
