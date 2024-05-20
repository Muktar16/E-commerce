import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/utility/common/user-roles.enum';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { AddItemDto } from './dto/add-item.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Cart')
@UseGuards(AuthGuard('jwt') ,new RoleGuard([Roles.USER]))
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add-item')
  create(@Body() item: AddItemDto, @Req() req: any){
    return this.cartService.addItemToCart(item, req.user.id);
  }

  @Get('remove-item/:productId')
  remove(@Req() req: any, @Param('productId') productId: number){
    return this.cartService.removeItemFromCart(+productId, +req.user.id);
  }

  @Get('get-cart')
  getCart(@Req() req: any){
    return this.cartService.getCart(req.user.id);
  }

  @Get('clear-cart')
  clearCart(@Req() req: any){
    return this.cartService.clearCart(req.user.id);
  }
}
