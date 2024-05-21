import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddItemDto } from '../dtos/add-item.dto';
import { CartEntity } from '../entities/cart.entity';
import { ProductService } from '../../product/providers/product.service';
import { CartItemEntity } from '../entities/cart-items.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private cartRepository: Repository<CartEntity>,
    @InjectRepository(CartItemEntity)
    private cartProductRepository: Repository<CartItemEntity>,
    private productService: ProductService,
  ) {}

  async createCart(cartInfo: { userId: number }) {
    const cart = this.cartRepository.create(cartInfo);
    return this.cartRepository.save(cart);
  }

  async getCart(userId: number) {
    return await this.cartRepository.findOne({
      where: { userId, isDeleted: false },
      relations: { cartItems: { product: true } },
    });
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
      relations: { cartItems: { product: true } },
    });

    const existingProduct = cart.cartItems.find((cartItem) => cartItem.product.id === itemInfo.productId);
    if (existingProduct) {
      existingProduct.quantity = itemInfo.quantity;
      await this.cartProductRepository.save(existingProduct);
      return existingProduct;
    }

    const cartProduct = this.cartProductRepository.create({
      quantity: itemInfo.quantity,
    });

    cartProduct.cart = cart;
    cartProduct.product = product;
    await this.cartProductRepository.save(cartProduct);
    return cartProduct;
  }

  async removeItemFromCart(productId: number, userId: number) {
    const cart = await this.cartRepository.findOne({
      where: { userId, isDeleted: false },
      relations: ['cartProducts', 'cartProducts.product'],
    });
    const cartProduct = cart.cartItems.find((cartItem) => cartItem.product.id === +productId);
    if (!cartProduct) {
      throw new HttpException('Product not found in cart', HttpStatus.NOT_FOUND);
    }
    cartProduct.isDeleted = true;
    await this.cartProductRepository.softDelete(cartProduct.id);
    return cartProduct;
  }

  async clearCart(userId: number) {
    const cart = await this.cartRepository.findOne({
      where: { userId, isDeleted: false },
      relations: ['cartProducts'],
    });
    cart.cartItems.forEach(async(cartItem) => {
      cartItem.isDeleted = true;
      await this.cartProductRepository.softDelete(cartItem.id);
    });
    await this.cartProductRepository.softRemove(cart.cartItems);
    return cart;
  }
}
