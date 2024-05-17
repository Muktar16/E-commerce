import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductService } from '../product/product.service';
import { AddItemDto } from './dto/add-item.dto';
import { CartProductEntity } from './entities/cart-products.entity';
import { CartEntity } from './entities/cart.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private cartRepository: Repository<CartEntity>,
    @InjectRepository(CartProductEntity)
    private cartProductRepository: Repository<CartProductEntity>,
    private productService: ProductService,
  ) {}

  async getCart(userId: number) {
    const res = await this.cartProductRepository.findOne({
      where: { id: userId },
      relations: { product: true, cart: true },
    });
    console.log(res);
    return res;
  }

  async createCart(cartInfo: { userId: number }) {
    const cart = this.cartRepository.create(cartInfo);
    return this.cartRepository.save(cart);
  }

  async addItemToCart(itemInfo: AddItemDto, userId: number) {
    const product = await this.productService.findOne(itemInfo.productId);
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    if (product.stockQuantity < itemInfo.quantity) {
      throw new HttpException(
        `Product quantity ${itemInfo.quantity} is greater than current stock ${product.stockQuantity}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    let cart = await this.cartRepository.findOne({
      where: { userId, isDeleted: false },
      relations: ['cartProducts', 'cartProducts.product'],
    });

    // const existingProduct = cart.cartProducts.find((cp) => cp.product.id === itemInfo.productId);
    // if (existingProduct) {
    //   existingProduct.quantity = itemInfo.quantity;
    //   await this.cartProductRepository.save(existingProduct);
    //   return existingProduct;
    // }

    const cartProduct = await this.cartProductRepository.create({
      quantity: itemInfo.quantity,
    });

    cartProduct.cart = cart;
    cartProduct.product = product;

    await this.cartProductRepository.save(cartProduct);
    // cart.cartProducts.push(cartProduct);
    // await this.cartRepository.save(cart);
    console.log(cartProduct);
    return cartProduct;
  }
}
