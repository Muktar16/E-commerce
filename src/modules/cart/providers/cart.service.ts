import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddItemDto } from '../dtos/add-item.dto';
import { CartEntity } from '../entities/cart.entity';
import { ProductGeneralService } from '../../product/providers/product-general.service';
import { CartItemEntity } from '../entities/cart-items.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private cartRepository: Repository<CartEntity>,
    @InjectRepository(CartItemEntity)
    private cartProductRepository: Repository<CartItemEntity>,
    private productService: ProductGeneralService,
  ) {}

  async createCart(cartInfo: { userId: number }) {
    const cart = this.cartRepository.create(cartInfo);
    return this.cartRepository.save(cart);
  }

  async getCart(userId: number): Promise<CartEntity> {
    return await this.cartRepository.findOne({
      where: { userId },
      relations: { cartItems: { product: true } },
    });
  }

  async addItemToCart(itemInfo: AddItemDto, userId: number): Promise<string> {
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

    const cart = await this.cartRepository.findOne({
      where: { userId },
      relations: { cartItems: { product: true } },
    });

    const existingProduct = cart.cartItems.find(
      (cartItem) => cartItem.product.id === itemInfo.productId,
    );
    if (existingProduct) {
      existingProduct.quantity = itemInfo.quantity;
      await this.cartProductRepository.save(existingProduct);
      return 'Item Successfully added to cart';
    }

    const cartProduct = this.cartProductRepository.create({
      quantity: itemInfo.quantity,
    });

    cartProduct.cart = cart;
    cartProduct.product = product;
    await this.cartProductRepository.save(cartProduct);
    return 'Item Successfully added to cart';
  }

  async removeItemFromCart(productId: number, userId: number): Promise<string> {
    const cart = await this.cartRepository.findOne({
      where: { userId },
      relations: { cartItems: { product: true } },
    });
    console.log(cart);
    const cartProduct = cart.cartItems.find(
      (cartItem) => cartItem.product.id === productId,
    );
    if (!cartProduct) {
      throw new HttpException(
        'Product not found in cart',
        HttpStatus.NOT_FOUND,
      );
    }
    await this.cartProductRepository.softDelete(cartProduct.id);
    return 'Item successfully removed from cart';
  }

  

  async clearCart(userId: number): Promise<string> {
    const cart = await this.cartRepository.findOne({
      where: { userId },
      relations: { cartItems: { product: true } },
    });
    cart.cartItems.forEach(async (cartItem) => {
      await this.cartProductRepository.softDelete(cartItem.id);
    });
    await this.cartProductRepository.softRemove(cart.cartItems);
    return 'Cart cleared successfully';
  }
}
