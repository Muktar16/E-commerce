import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { CartService } from '../providers/cart.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/common/enums/user-roles.enum';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { AddItemDto } from '../dtos/add-item.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Cart')
@UseGuards(AuthGuard('jwt') ,new RoleGuard([Roles.USER]))
@Controller('carts')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiBearerAuth()
  @Post('add-item')
  create(@Body() item: AddItemDto, @Req() req: any){
    return this.cartService.addItemToCart(item, req.user.id);
  }

  @Get('remove-item/:productId')
  remove(@Req() req: any, @Param('productId') productId: number){
    return this.cartService.removeItemFromCart(+productId, +req.user.id);
  }

  @ApiBearerAuth()
  @Get('get')
  getCart(@Req() req: any){
    console.log(req.user);
    return this.cartService.getCart(+req.user.id);
  }

  @ApiBearerAuth()
  @Get('clear')
  clearCart(@Req() req: any){
    return this.cartService.clearCart(req.user.id);
  }
}
