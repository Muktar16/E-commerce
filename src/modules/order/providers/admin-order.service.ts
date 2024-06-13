import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseType } from 'src/common/interfaces/response.interface';
import { OrderEntity } from '../entities/order.entity';
import { Repository } from 'typeorm';
import { UpdateStatusDto } from '../dtos/update-status.dto';
import { GetAllOrdersQueryDto } from '../dtos/get-all-orders-query.dto';
import { plainToInstance } from 'class-transformer';
import { ProductEntity } from 'src/modules/product/entities/product.entity';
import { OrderedProduct } from '../dtos/ordered-product.dto';
import { PaginatedDataResponseDto } from 'src/common/dtos/PaginatedDataResponse.dto';

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

  async deleteOrder(id: number): Promise<string> {
    const order = await this.orderRepository.findOne({where: { id }});
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    await this.orderRepository.softDelete(order.id);
    return 'Order deleted successfully';
  }

  async getAllOrders(query: GetAllOrdersQueryDto) {
    const { orderStatus, dateFrom, dateTo, userId, limit, offset, page, size } = query;

    console.log('query', query);
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

    let [orders, total] = await this.orderRepository.findAndCount({
      // where: whereCondition,
      relations: ['user'],
      take,
      skip,
    });
    // convert to plain object
    // orders = orders.map((order) => plainToInstance(OrderEntity, order));
    // convert order products to plain object
    orders = orders.map((order) => {
      order.products = order.products.map((orderProduct) =>
        plainToInstance(OrderedProduct, orderProduct),
      );
      return plainToInstance(OrderEntity, order);
    });
    // console.log('orders', orders);
    // return orders
    return plainToInstance(PaginatedDataResponseDto, { data: orders, total });
  }
}
