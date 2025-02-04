import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import * as moment from 'moment';
import { DiscountEnum } from 'src/common/enums/discount.enum';
import { OrderStatus } from 'src/modules/order/enums/order-status.enum';
import { UserPromoEntity } from 'src/modules/promo/entities/user_promos.entity';
import { PromoService } from 'src/modules/promo/providers/promo.service';
import { UserCrudService } from 'src/modules/user/providers/user-crud.service';
import { Repository } from 'typeorm';
import { CartService } from '../../cart/providers/cart.service';
import { ProductGeneralService } from '../../product/providers/product-general.service';
import { CreateOrderResponseDto } from '../dtos/create-order-response.dto';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { OrderInvoice } from '../dtos/ordered-invoice.dto';
import { OrderedProduct } from '../dtos/ordered-product.dto';
import { OrderEntity } from '../entities/order.entity';

const DELIVERY_CHARGE = 40;

@Injectable()
export class UserOrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    private readonly cartService: CartService,
    private readonly userService: UserCrudService,
    private readonly productService: ProductGeneralService,
    private readonly promoService: PromoService,
    @InjectRepository(UserPromoEntity)
    private readonly userPromoRepository: Repository<UserPromoEntity>,
  ) {}

  async create(
    createOrderDto: CreateOrderDto,
    userId: number,
  ): Promise<CreateOrderResponseDto> {
    const user = await this.userService.getUserWithCart(userId);

    if (!user.cart.cartItems.length) {
      throw new HttpException('Your Cart is empty', HttpStatus.BAD_REQUEST);
    }

    const currentDate = moment().toISOString();
    const {
      totalAmount,
      totalAmountAfterDiscount,
      orderedProducts,
      promoDiscount,
    } = await this.calculateTotalAmount(
      user.cart.cartItems,
      createOrderDto.promoCode,
      currentDate,
      userId,
    );

    const orderInvoice = this.calculateOrderInvoice(
      totalAmount,
      totalAmountAfterDiscount,
      promoDiscount,
      createOrderDto.promoCode,
    );

    await this.updateStockQuantities(user.cart.cartItems);

    const newOrder = await this.saveOrder(
      createOrderDto,
      user,
      orderedProducts,
      orderInvoice,
    );

    if (createOrderDto.promoCode) {
      await this.updatePromoUsage(createOrderDto.promoCode, userId);
    }

    await this.cartService.clearCart(userId);

    return plainToInstance(CreateOrderResponseDto, newOrder);
  }

  private async calculateTotalAmount(
    cartItems,
    promoCode: string,
    currentDate: string,
    userId: number,
  ) {
    let totalAmount = 0;
    let totalAmountAfterDiscount = 0;
    const orderedProducts: OrderedProduct[] = [];
    let promoDiscount = 0;

    for (const cp of cartItems) {
      const product = await this.productService.findOne(cp.product.id);

      if (product.stockQuantity < cp.quantity) {
        throw new HttpException(
          `Stock quantity is not available for the product '${cp.product.name}'. Current stock: ${product.stockQuantity}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const { priceAfterDiscount, discount, discountType } = this.applyDiscount(
        product,
        currentDate,
      );

      totalAmount += product.price * cp.quantity;
      totalAmountAfterDiscount += priceAfterDiscount * cp.quantity;

      orderedProducts.push({
        productId: +product.id,
        quantity: +cp.quantity,
        price: +product.price,
        discount: discount,
        discountType: discountType,
        priceAfterDiscount: priceAfterDiscount,
      });
    }

    if (promoCode) {
      const { promo } = await this.validatePromoCode(
        promoCode,
        userId,
        currentDate,
      );
      promoDiscount =
        (totalAmountAfterDiscount * promo.discountPercentage) / 100;
    }

    return {
      totalAmount,
      totalAmountAfterDiscount,
      orderedProducts,
      promoDiscount,
    };
  }

  private applyDiscount(product, currentDate) {
    let discount = 0;
    let priceAfterDiscount = product.price;
    let discountType: any;

    if (
      product.discount &&
      moment(product.discount.validTo).isAfter(currentDate, 'day') &&
      moment(product.discount.validFrom).isBefore(currentDate, 'day')
    ) {
      discountType = product.discount.type;
      if (discountType === DiscountEnum.PERCENTAGE) {
        discount = product.discount.value;
        priceAfterDiscount = product.price - (product.price * discount) / 100;
      } else if (discountType === DiscountEnum.FLAT) {
        discount = product.discount.value;
        if (product.price > discount)
          priceAfterDiscount = product.price - discount;
      }
    }

    return { priceAfterDiscount, discount, discountType };
  }

  private async validatePromoCode(
    promoCode: string,
    userId: number,
    currentDate: string,
  ) {
    const promo = await this.promoService.findOneConditionally({
      code: promoCode,
    });

    if (
      !promo ||
      moment(promo.endDate).isBefore(currentDate) ||
      moment(promo.startDate).isAfter(currentDate)
    ) {
      throw new HttpException(
        'Invalid or expired promo code',
        HttpStatus.BAD_REQUEST,
      );
    }

    const userPromo = await this.userPromoRepository.findOne({
      where: { promo: { id: promo.id }, user: { id: userId } },
    });

    if (!userPromo) {
      throw new HttpException(
        'Promo code not found for the user',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (promo.usageLimit !== null && userPromo.usageCount >= promo.usageLimit) {
      throw new HttpException(
        'Promo code usage limit exceeded',
        HttpStatus.BAD_REQUEST,
      );
    }

    return { promo, userPromo };
  }

  private calculateOrderInvoice(
    totalAmount: number,
    totalAmountAfterDiscount: number,
    promoDiscount: number,
    promoCode: string,
  ): OrderInvoice {
    return {
      itemsSubTotal: totalAmount,
      itemsSubTotalAfterDiscount: totalAmountAfterDiscount,
      deliveryCharge: DELIVERY_CHARGE,
      promoCode: promoCode,
      promoDiscount: promoDiscount,
      totalOrderAmountAfterDiscount: totalAmountAfterDiscount - promoDiscount,
      totalPayableAmount:
        totalAmountAfterDiscount - promoDiscount + DELIVERY_CHARGE,
    };
  }

  private async updateStockQuantities(cartItems) {
    for (const cp of cartItems) {
      const product = await this.productService.findOne(cp.product.id);
      product.stockQuantity -= cp.quantity;
      await this.productService.updateById(cp.product.id, product);
    }
  }

  private async saveOrder(createOrderDto, user, orderedProducts, orderInvoice) {
    const order: Partial<OrderEntity> = {
      orderStatus: OrderStatus.Pending,
      shippingAddress: createOrderDto.shippingAddress,
      contactNumber: createOrderDto.contactNumber,
      orderDate: new Date(),
      products: orderedProducts,
      orderInvoice: orderInvoice,
      user: user,
    };

    const newOrder = this.orderRepository.create(order);
    await this.orderRepository.save(newOrder);

    return newOrder;
  }

  private async updatePromoUsage(promoCode: string, userId: number) {
    const userPromo = await this.userPromoRepository.findOne({
      where: {
        promo: { code: promoCode },
        user: { id: userId },
      },
    });

    if (userPromo) {
      userPromo.usageCount += 1;
      await this.userPromoRepository.update(+userPromo.id, userPromo);
    }
  }

  async cancelOrder(id: number, userId: number) {
    const order = await this.orderRepository.findOne({
      where: { id, user: { id: userId } },
    });

    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }

    if (
      order.orderStatus !== OrderStatus.Pending &&
      order.orderStatus !== OrderStatus.Confirmed &&
      order.orderStatus !== OrderStatus.Processing
    ) {
      throw new HttpException(
        `Order with status '${order.orderStatus}' cannot be cancelled`,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.updateCancelledOrderStock(order.products);
    order.products = order.products.map((product) =>
      plainToInstance(OrderedProduct, product),
    );
    order.orderInvoice = plainToInstance(OrderInvoice, order.orderInvoice);
    order.orderStatus = OrderStatus.Cancelled;
    await this.orderRepository.save(order);

    return order;
  }

  private async updateCancelledOrderStock(products) {
    for (const product of products) {
      const prod = await this.productService.findOne(product.productId);
      prod.stockQuantity += product.quantity;
      await this.productService.updateById(product.productId, prod);
    }
  }

  async findOrderHistory(userId: number) {
    const orders = await this.orderRepository.find({
      where: { user: { id: userId } },
    });

    orders.forEach((order) => {
      order.orderInvoice = plainToInstance(OrderInvoice, order.orderInvoice);
      order.products = order.products.map((product) =>
        plainToInstance(OrderedProduct, product),
      );
    });

    return orders;
  }

  async findOneById(id: number, userId: number) {
    const order = await this.orderRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    order.orderInvoice = plainToInstance(OrderInvoice, order.orderInvoice);
    order.products = order.products.map((product) =>
      plainToInstance(OrderedProduct, product),
    );
    return order;
  }
}

// import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// // import { OrderedProduct } from 'src/common/interfaces/ordered-product.interface';
// import { ResponseType } from 'src/common/interfaces/response.interface';
// import { OrderStatus } from 'src/modules/order/enums/order-status.enum';
// import { UserCrudService } from 'src/modules/user/providers/user-crud.service';
// import { Connection, EntityManager, Repository } from 'typeorm';
// import { CartService } from '../../cart/providers/cart.service';
// import { ProductGeneralService } from '../../product/providers/product-general.service';
// import { CreateOrderDto } from '../dtos/create-order.dto';
// import { OrderEntity } from '../entities/order.entity';
// // import { OrderInvoice } from 'src/common/interfaces/order-invoice.interface';
// import { PromoEntity } from 'src/modules/promo/entities/promo.entity';
// import * as moment from 'moment';
// import { DiscountEnum } from 'src/common/enums/discount.enum';
// import { PromoService } from 'src/modules/promo/providers/promo.service';
// import { Transactional } from 'typeorm-transactional-cls-hooked';
// import { CreateOrderResponseDto } from '../dtos/create-order-response.dto';
// import { UserPromoEntity } from 'src/modules/promo/entities/user_promos.entity';
// import { classToPlain, instanceToPlain, plainToInstance } from 'class-transformer';
// import { OrderedProduct } from '../dtos/ordered-product.dto';
// import { OrderInvoice } from '../dtos/ordered-invoice.dto';

// const deliveryCharge = 40;

// @Injectable()
// export class UserOrderService {
//   constructor(
//     @InjectRepository(OrderEntity)
//     private orderRepository: Repository<OrderEntity>,
//     private cartService: CartService,
//     private userService: UserCrudService,
//     private productService: ProductGeneralService,
//     private promoService: PromoService,
//     @InjectRepository(UserPromoEntity)
//     private userPromoRepository: Repository<UserPromoEntity>,
//   ) {}

//   async create(
//     createOrderDto: CreateOrderDto,
//     userId: number,
//   ): Promise<CreateOrderResponseDto> {
//     const user = await this.userService.getUserWithCart(userId);
//     if (user.cart.cartItems.length < 1) {
//       throw new HttpException('Your Cart is empty', HttpStatus.BAD_REQUEST);
//     }

//     const currentDate = moment().toISOString();
//     let totalAmount = 0;
//     let totalAmountAfterDiscount = 0;
//     let orderedProducts: OrderedProduct[] = [];
//     let promoDiscount = 0;

//     // Calculate total amount and apply discounts
//     for (const cp of user.cart.cartItems) {
//       const product = await this.productService.findOne(cp.product.id);
//       // Check stock quantity
//       if (product.stockQuantity < cp.quantity) {
//         throw new HttpException(
//           `Stock quantity is not available for the product '${cp.product.name}'. Current stock: ${product.stockQuantity}`,
//           HttpStatus.BAD_REQUEST,
//         );
//       }
//       // Apply discount if available and valid
//       let discount = 0;
//       let priceAfterDiscount = product.price;
//       let discountType: any;

//       if (
//         product.discount &&
//         moment(product.discount.validTo).isAfter(currentDate, 'day') &&
//         moment(product.discount.validFrom).isBefore(currentDate, 'day')
//       ) {
//         discountType = product.discount.type;
//         if (discountType === DiscountEnum.PERCENTAGE) {
//           discount = product.discount.value;
//           priceAfterDiscount = product.price - (product.price * discount) / 100;
//         } else if (discountType === DiscountEnum.FLAT) {
//           discount = product.discount.value;
//           if (product.price > discount)
//             priceAfterDiscount = product.price - discount;
//         }
//       }

//       totalAmount += product.price * cp.quantity;
//       totalAmountAfterDiscount += priceAfterDiscount * cp.quantity;

//       orderedProducts.push({
//         productId: +product.id,
//         quantity: +cp.quantity,
//         price: +product.price,
//         discount: discount,
//         discountType: discountType,
//         priceAfterDiscount: priceAfterDiscount,
//       });
//     }

//     // Validate promo code if provided
//     let promoCode: PromoEntity = null;
//     let userPromo: UserPromoEntity = null;

//     if (createOrderDto.promoCode) {
//       promoCode = await this.promoService.findOneConditionally({
//         code: createOrderDto.promoCode,
//       });
//       if (
//         !promoCode ||
//         moment(promoCode.endDate).isBefore(currentDate) ||
//         moment(promoCode.startDate).isAfter(currentDate)
//       ) {
//         throw new HttpException(
//           'Invalid or expired promo code',
//           HttpStatus.BAD_REQUEST,
//         );
//       }

//       userPromo = await this.userPromoRepository.findOne({
//         where: {
//           promo: { id: promoCode.id },
//           user: { id: userId },
//         },
//       });

//       if (!userPromo) {
//         throw new HttpException(
//           'Promo code not found for the user',
//           HttpStatus.BAD_REQUEST,
//         );
//       }

//       if (
//         promoCode.usageLimit !== null &&
//         userPromo.usageCount >= promoCode.usageLimit
//       ) {
//         throw new HttpException(
//           'Promo code usage limit exceeded',
//           HttpStatus.BAD_REQUEST,
//         );
//       }

//       promoDiscount =
//         (totalAmountAfterDiscount * promoCode.discountPercentage) / 100;
//     }

//     const orderInvoice: OrderInvoice = {
//       itemsSubTotal: totalAmount,
//       itemsSubTotalAfterDiscount: totalAmountAfterDiscount,
//       deliveryCharge: deliveryCharge,
//       promoCode: createOrderDto.promoCode,
//       promoDiscount: promoDiscount,
//       totalOrderAmountAfterDiscount: totalAmountAfterDiscount - promoDiscount,
//       totalPayableAmount:
//         totalAmountAfterDiscount - promoDiscount + deliveryCharge,
//     };

//     // Update stock quantity
//     for (const cp of user.cart.cartItems) {
//       const product = await this.productService.findOne(cp.product.id);
//       product.stockQuantity -= cp.quantity;
//       await this.productService.updateById(cp.product.id, product);
//     }

//     const order: Partial<OrderEntity> = {
//       orderStatus: OrderStatus.Pending,
//       shippingAddress: createOrderDto.shippingAddress,
//       contactNumber: createOrderDto.contactNumber,
//       orderDate: new Date(),
//       products: orderedProducts,
//       orderInvoice: orderInvoice,
//       user: user,
//     };

//     // Create and save the order
//     const newOrder = this.orderRepository.create(order);
//     await this.orderRepository.save(newOrder);

//     // Update user promo usage count
//     if (userPromo) {
//       userPromo.usageCount += 1;
//       await this.userPromoRepository.update(+userPromo.id, userPromo);
//     }

//     // Clear the cart
//     await this.cartService.clearCart(userId);

//     // Return the response
//     const response: CreateOrderResponseDto = {
//       id: newOrder.id,
//       orderStatus: newOrder.orderStatus,
//       shippingAddress: newOrder.shippingAddress,
//       contactNumber: newOrder.contactNumber,
//       orderDate: newOrder.orderDate,
//       products: newOrder.products.map((product: any) => ({
//         productId: product.productId,
//         quantity: product.quantity,
//         price: product.price,
//         discount: product.discount,
//         priceAfterDiscount: product.priceAfterDiscount,
//         discountType: product.discountType,
//       })),
//       orderInvoice: plainToInstance(OrderInvoice, newOrder.orderInvoice),
//       userId: newOrder.user.id,
//     };
//     // return response;
//     return plainToInstance(CreateOrderResponseDto, newOrder);
//   }

//   async cancelOrder(id: number, userId: number) {
//     const order = await this.orderRepository.findOne({ where: { id, user: {id:userId} } });
//     if (!order) {
//       throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
//     }
//     // only orders with status 'Pending' or 'Confirmed' or 'Processing' can be cancelled
//     if (
//       order.orderStatus !== OrderStatus.Pending &&
//       order.orderStatus !== OrderStatus.Confirmed &&
//       order.orderStatus !== OrderStatus.Processing
//     ) {
//       throw new HttpException(
//         `Order with status '${order.orderStatus}' cannot be cancelled`,
//         HttpStatus.BAD_REQUEST,
//       );
//     }

//     // Update stock quantity
//     for (const cp of order.products) {
//       const product = await this.productService.findOne(cp.productId);
//       product.stockQuantity += cp.quantity;
//       await this.productService.updateById(cp.productId, product);
//     }
//     // convert each ordered product to plainToInstance OrderedProduct
//     order.products = order.products.map((product: any) => {
//       return plainToInstance(OrderedProduct, product);
//     });
//     // convert invoice to plainToInstance OrderInvoice
//     order.orderInvoice = plainToInstance(OrderInvoice, order.orderInvoice);
//     // Update order status to 'Cancelled'
//     order.orderStatus = OrderStatus.Cancelled;
//     await this.orderRepository.save(order);

//     return order;
//   }

//   async findOrderHistory(userId: number) {

//       const orders = await this.orderRepository.find({
//         where: {
//           user: { id: userId },
//         },
//       });
//       // conver each order invoice to palinToinstanc OrderInvoice
//       orders.forEach((order) => {
//         order.orderInvoice = plainToInstance(OrderInvoice, order.orderInvoice);
//       });
//       // convert each ordered product to plainToInstance OrderedProduct
//       orders.forEach((order) => {
//         order.products = order.products.map((product: any) => {
//           return plainToInstance(OrderedProduct, product);
//         });
//       });
//       console.log({orders})
//       return orders;
//   }

//   async findOneById(id: number, userId: number) {
//     const order = await this.orderRepository.findOne({
//       where: { id, user: { id: userId } },
//     });
//     if (!order) {
//       throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
//     }
//     order.orderInvoice = plainToInstance(OrderInvoice, order.orderInvoice);
//     order.products = order.products.map((product: any) => {
//       return plainToInstance(OrderedProduct, product);
//     });
//     return order;
//   }

// }
