import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddItemDto } from './dto/add-item.dto';
import { CartProductEntity } from './entities/cart-products.entity';
import { CartEntity } from './entities/cart.entity';
import { ProductService } from '../product/product.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private cartRepository: Repository<CartEntity>,
    @InjectRepository(CartProductEntity)
    private cartProductRepository: Repository<CartProductEntity>,
    private productService: ProductService,
  ) {}

  async createCart(cartInfo: { userId: number }) {
    const cart = this.cartRepository.create(cartInfo);
    return this.cartRepository.save(cart);
  }

  async getCart(userId: number) {
    return await this.cartRepository.findOne({
      where: { userId, isDeleted: false },
      relations: ['cartProducts', 'cartProducts.product'],
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
      relations: ['cartProducts', 'cartProducts.product'],
    });

    const existingProduct = cart.cartProducts.find((cp) => cp.product.id === itemInfo.productId);
    if (existingProduct) {
      existingProduct.quantity = itemInfo.quantity;
      await this.cartProductRepository.save(existingProduct);
      return existingProduct;
    }

    const cartProduct = await this.cartProductRepository.create({
      quantity: itemInfo.quantity,
    });

    cartProduct.cart = cart;
    cartProduct.product = product;
    await this.cartProductRepository.save(cartProduct);
    return cartProduct;
  }

  async removeItemFromCart(productId: number, userId: number) {
    console.log(productId, userId);
    const cart = await this.cartRepository.findOne({
      where: { userId, isDeleted: false },
      relations: ['cartProducts', 'cartProducts.product'],
    });
    const cartProduct = cart.cartProducts.find((cp) => cp.product.id === +productId);
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
    cart.cartProducts.forEach(async(cp) => {
      cp.isDeleted = true;
      await this.cartProductRepository.softDelete(cp.id);
    });
    await this.cartProductRepository.softRemove(cart.cartProducts);
    return cart;
  }
}
