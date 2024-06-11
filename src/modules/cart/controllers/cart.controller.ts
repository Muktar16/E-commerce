import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { CartService } from '../providers/cart.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/common/enums/user-roles.enum';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { AddItemDto } from '../dtos/add-item.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CartEntity } from '../entities/cart.entity';
import { CartResponseDto } from '../dtos/get-cart-response.dto';

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt') ,new RoleGuard([Roles.USER]))
@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({ summary: 'Add item to cart' })
  @ApiOkResponse({ description: 'Item added to cart', type: String })
  @Post('add-item')
  create(@Body() item: AddItemDto, @Req() req: any): Promise<string>{
    return this.cartService.addItemToCart(item, +req.user.id);
  }

  @Delete('remove-item/:productId')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiOkResponse({ description: 'Item removed from cart', type: String })
  remove(@Req() req: any, @Param('productId') productId: number): Promise<string>{
    return this.cartService.removeItemFromCart(+productId, +req.user.id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get cart' })
  @ApiOkResponse({ description: 'Cart', type: CartResponseDto })
  @Get()
  getCart(@Req() req: any){
    return this.cartService.getCart(+req.user.id);
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Clear cart' })
  @ApiOkResponse({ description: 'Cart cleared', type: String })
  clearCart(@Req() req: any): Promise<string>{
    return this.cartService.clearCart(+req.user.id);
  }
}
