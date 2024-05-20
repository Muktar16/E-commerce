import { Controller, Get, Param, ParseBoolPipe, Query, Req, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';
import { UserCrudService } from '../providers/user-crud.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/utility/common/user-roles.enum';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { PaginationDto } from '../dto/pagination.dto';
import { FilterUserDto } from '../dto/filter-user.dto';
import { ResponseType } from 'src/utility/interfaces/response.interface';

@ApiBearerAuth()
@ApiTags('User')
@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserCrudController {
  constructor(private readonly userCrudService: UserCrudService) {}

  @Get('my-profile')
  async getMyProfile(@Req() req:any){
    return this.userCrudService.findOneById(+req.user.id);
  }

  @UseGuards(new RoleGuard([Roles.SUPERADMIN]))
  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query() filterUserDto: FilterUserDto,
  ): Promise<ResponseType> {
    return this.userCrudService.findAll(paginationDto, filterUserDto);
  }

  @UseGuards(new RoleGuard([Roles.SUPERADMIN]))
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserEntity> {
    return this.userCrudService.findOneById(+id);
  }
}
