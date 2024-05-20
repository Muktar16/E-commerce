import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CartService } from '../cart/cart.service';
import { OrderedProduct } from 'src/utility/interfaces/ordered-product.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { ProductService } from '../product/product.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
    private cartService: CartService,
    private userService: UserService,
    private productService: ProductService,
  ) {}
  async create(createOrderDto: CreateOrderDto, userId: number) {
    const user = await this.userService.getUserWithCart(userId);
    console.log(user.cart.cartProducts);
    // Calculate total amount & check stock quantity is available & create products for order
    let totalAmount = 0;
    let orderProducts: OrderedProduct[] = [];
    for (const cp of user.cart.cartProducts) {
      if (cp.product.stockQuantity < cp.quantity) {
        throw new Error(
          'Stock quantity is not available for the product with name: ' +
            cp.product.name +
            'Current stock: ' +
            cp.product.stockQuantity,
        );
      }
      totalAmount += cp.product.price * cp.quantity;
      orderProducts.push({
        productId: +cp.product.id,
        quantity: cp.quantity,
        price: cp.product.price,
      });
    }
    // update stock quantity
    for (const cp of user.cart.cartProducts) {
      const product = await this.productService.findOne(cp.product.id);
      product.stockQuantity -= cp.quantity;
      await this.productService.update(cp.product.id, product);
    }
    // await this.userService.updateUser(userId, user);
    
    const order: Partial<OrderEntity> = {
      totalAmount,
      user,
      orderDate: new Date(),
      products: orderProducts,
      shippingAddress: createOrderDto.shippingAddress,
    }
    // create order
    this.orderRepository.create(order);
    return await this.orderRepository.save(order);
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
