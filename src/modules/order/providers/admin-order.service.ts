import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseType } from 'src/utility/interfaces/response.interface';
import { OrderEntity } from '../entities/order.entity';
import { Repository } from 'typeorm';
import { UpdateStatusDto } from '../dto/update-status.dto';

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
      where: { id, isDeleted: false },
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

  async deleteOrder(id: number): Promise<ResponseType> {
    const order = await this.orderRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    order.isDeleted = true;
    await this.orderRepository.softDelete(order.id);
    return {
      data: null,
      message: 'Order deleted successfully',
    };
  }

  async getAllOrders(query: any): Promise<ResponseType> {
    const { orderStatus, dateFrom, dateTo, userId, limit, offset, page, size } = query;

    const whereCondition: any = { isDeleted: false };

    if (orderStatus) {
      whereCondition.orderStatus = orderStatus;
    }

    if (dateFrom && dateTo) {
      whereCondition.createdAt = {
        $gte: new Date(dateFrom),
        $lte: new Date(dateTo),
      };
    } else if (dateFrom) {
      whereCondition.createdAt = { $gte: new Date(dateFrom) };
    } else if (dateTo) {
      whereCondition.createdAt = { $lte: new Date(dateTo) };
    }

    if (userId) {
      whereCondition.user = { id: userId };
    }

    const take = limit || size || 10;
    const skip = offset || ((page - 1) * take) || 0;

    const [orders, total] = await this.orderRepository.findAndCount({
      where: whereCondition,
      relations: ['user'],
      take,
      skip,
    });

    return {
      data: {orders, total},
      message: 'Orders fetched successfully',
    };
  }
}
