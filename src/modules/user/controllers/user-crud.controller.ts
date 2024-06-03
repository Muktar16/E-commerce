import { Controller, Delete, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Roles } from 'src/common/enums/user-roles.enum';
import { UserResponseDto } from 'src/shared/auth/dtos/user-response.dto';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { AllUsersResponseDto } from '../dtos/all-users-response.dto';
import { FilterUserDto } from '../dtos/filter-user.dto';
import { PaginationDto } from '../../../common/dtos/pagination.dto';
import { UserCrudService } from '../providers/user-crud.service';

@ApiBearerAuth()
@ApiTags('User')
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UserCrudController {
  constructor(private readonly userCrudService: UserCrudService) {}

  @Get('my-profile')
  @ApiOkResponse({ description: 'My Profile Response', type: UserResponseDto })
  async getMyProfile(@Req() req:any): Promise<UserResponseDto>{
    console.log('User Profile: ', req.user);
  
    const userProfile = this.userCrudService.findOneById(+req.user.id);
    return plainToInstance(UserResponseDto, userProfile);
  }

  @UseGuards(new RoleGuard([Roles.SUPERADMIN, Roles.ADMIN]))
  @Get()
  @ApiOkResponse({ description: 'All Users Response', type: AllUsersResponseDto })
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query() filterUserDto: FilterUserDto,
  ): Promise<AllUsersResponseDto> {
    const { users, total } = await this.userCrudService.findAll(paginationDto, filterUserDto);
    return plainToInstance(AllUsersResponseDto, { total, users: plainToInstance(UserResponseDto, users) });
  }

  @UseGuards(new RoleGuard([Roles.SUPERADMIN, Roles.ADMIN]))
  @ApiOkResponse({ description: 'User Response', type: UserResponseDto })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    const user = this.userCrudService.findOneById(+id);
    return plainToInstance(UserResponseDto, user);
  }

  @Delete('delete-account')
  async deleteAccount(@Req() req:any){
    return this.userCrudService.deleteAccount(+req.user.id);
  }
}
