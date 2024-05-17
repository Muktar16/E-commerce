import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/utility/common/user-roles.enum';
import { RoleGuard } from 'src/modules/shared/guards/role.guard';
import { AddItemDto } from './dto/add-item.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add-item')
  @UseGuards(AuthGuard('jwt') ,new RoleGuard([Roles.USER]))
  create(@Body() item: AddItemDto, @Req() req: any){
    return this.cartService.addItemToCart(item, req.user.id);
  }

  @Get('get-cart')
  // @UseGuards(AuthGuard('jwt') ,new RoleGuard([Roles.USER]))
  getCart(@Req() req: any){
    return this.cartService.getCart(2);
  }
}
