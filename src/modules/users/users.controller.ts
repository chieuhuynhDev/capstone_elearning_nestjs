import { Controller, Get, Post, Body, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('')
  async findAll() {
    return this.usersService.findAll();
  }

  @Delete('delete')
  // @UseGuards(JwtAuthGuard, RolesGuard) // Only GV
  async deleteUser(@Body('username') username: string) {
    return this.usersService.deleteUser(username);
  }

  @Get('get-user-pagination')
  async getPaginatedUsers(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.usersService.getPaginatedUsers(page, pageSize);
  }
}
