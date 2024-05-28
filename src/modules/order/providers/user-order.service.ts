import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderedProduct } from 'src/common/interfaces/ordered-product.interface';
import { ResponseType } from 'src/common/interfaces/response.interface';
import { OrderStatus } from 'src/modules/order/enums/order-status.enum';
import { UserCrudService } from 'src/modules/user/providers/user-crud.service';
import { Repository } from 'typeorm';
import { CartService } from '../../cart/providers/cart.service';
import { ProductGeneralService } from '../../product/providers/product-general.service';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { OrderEntity } from '../entities/order.entity';

@Injectable()
export class UserOrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    private cartService: CartService,
    private userService: UserCrudService,
    private productService: ProductGeneralService,
  ) {}
  async create(
    createOrderDto: CreateOrderDto,
    userId: number,
  ): Promise<ResponseType> {
    const user = await this.userService.getUserWithCart(userId);
    if (user.cart.cartItems.length < 1) {
      throw new HttpException('Cart is empty', HttpStatus.BAD_REQUEST);
    }
    let totalAmount = 0;
    let orderedProducts: OrderedProduct[] = [];
    // check stock quantity
    for (const cp of user.cart.cartItems) {
      if (cp.product.stockQuantity < cp.quantity) {
        throw new HttpException(
          "Stock quantity is not available for the product '" +
            cp.product.name +
            "'. Current stock: " +
            cp.product.stockQuantity,
          HttpStatus.BAD_REQUEST,
        );
      }
      totalAmount += cp.product.price * cp.quantity;
      orderedProducts.push({
        productId: +cp.product.id,
        quantity: +cp.quantity,
        price: +cp.product.price,
      });
    }
    // update stock quantity
    for (const cp of user.cart.cartItems) {
      const product = await this.productService.findOne(cp.product.id);
      product.stockQuantity -= cp.quantity;
      await this.productService.updateById(cp.product.id, product);
    }

    const order: Partial<OrderEntity> = {
      totalAmount,
      user,
      orderDate: new Date(),
      products: orderedProducts,
      shippingAddress: createOrderDto.shippingAddress,
    };
    // create order
    this.orderRepository.create(order);
    // clear cart
    await this.cartService.clearCart(userId);
    await this.orderRepository.save(order);
    return { message: 'Order created successfully', data: order };
  }

  async cancelOrder(id:number): Promise<ResponseType> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    // update stock quantity
    for (const cp of order.products) {
      const product = await this.productService.findOne(cp.productId);
      product.stockQuantity += cp.quantity;
      await this.productService.updateById(cp.productId, product);
    }
    order.orderStatus = OrderStatus.Cancelled;
    await this.orderRepository.save(order);

    return {
      message: 'Order cancelled successfully',
      data: order,
    };
  }

  async findOrderHistory(userId: number): Promise<ResponseType> {
    return {
      message: 'Successfully fetched order history',
      data: await this.orderRepository.find({
        where: {
          user: { id: userId },
        },
        // relations: ['user'],
      }),
    };
  }

  async findOneById(id: number): Promise<ResponseType> {
    return {
      message: 'Successfully fetched order',
      data: await this.orderRepository.findOne({ where: { id } }),
    };
  }
}
