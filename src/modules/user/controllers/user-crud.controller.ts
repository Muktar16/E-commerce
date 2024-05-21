import { Controller, Delete, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { Roles } from 'src/common/enums/user-roles.enum';
import { ResponseType } from 'src/common/interfaces/response.interface';
import { FilterUserDto } from '../dto/filter-user.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { UserEntity } from '../entities/user.entity';
import { UserCrudService } from '../providers/user-crud.service';

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

  @Delete('delete-account')
  async deleteAccount(@Req() req:any){
    return this.userCrudService.deleteAccount(+req.user.id);
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
