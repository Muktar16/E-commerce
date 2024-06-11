import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/common/enums/user-roles.enum';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { CreatePromoDto } from '../dto/create-promo.dto';
import { MyPromosResponseDto } from '../dto/mypromos-res.dot';
import { PromoQueryDto } from '../dto/promo-query.dto';
import { UpdatePromoDto } from '../dto/update-promo.dto';
import { PromoEntity } from '../entities/promo.entity';
import { PromoService } from '../providers/promo.service';

@ApiTags('Promos')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('promos')
export class PromoController {
  constructor(private readonly promoService: PromoService) {}



  @UseGuards(new RoleGuard([Roles.SUPERADMIN, Roles.ADMIN]))
  @ApiOperation({ summary: 'Create a new promo' })
  @ApiOkResponse({ description: 'Promo created successfully', type: String })
  @Post()
  create(@Body() createPromoDto: CreatePromoDto) {
    return this.promoService.create(createPromoDto);
  }

  @UseGuards(new RoleGuard([Roles.SUPERADMIN, Roles.ADMIN]))
  @ApiOperation({ summary: 'List all promos' })
  @ApiOkResponse({ description: 'List of all promos', type: [PromoEntity] })
  @Get()
  findAll(@Query() query: PromoQueryDto) {
    return this.promoService.findAll(query);
  }

  @UseGuards( new RoleGuard([Roles.SUPERADMIN, Roles.ADMIN]))
  @ApiOkResponse({ description: 'Promo found successfully', type: PromoEntity })
  @ApiOperation({ summary: 'Find a promo by id' })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.promoService.findOne(+id);
  }

  @UseGuards( new RoleGuard([Roles.SUPERADMIN, Roles.ADMIN]))
  @ApiOperation({ summary: 'Update a promo by id' })
  @ApiOkResponse({ description: 'Promo updated successfully', type: String })
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updatePromoDto: UpdatePromoDto,
  ): Promise<string> {
    return this.promoService.update(+id, updatePromoDto);
  }

  @UseGuards(new RoleGuard([Roles.SUPERADMIN, Roles.ADMIN]))
  @ApiOperation({ summary: 'Delete a promo by id' })
  @ApiOkResponse({ description: 'Promo deleted successfully', type: String })
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.promoService.remove(+id);
  }

  @Get('user/my-promos')
  @ApiOperation({ summary: 'Get all promos for the logged in user' })
  @ApiOkResponse({ description: 'List of all promos', type: [MyPromosResponseDto] })
  findMyPromos(@Req() req: any) {
    return this.promoService.findMyPromos(+req.user.id);
  }

}
