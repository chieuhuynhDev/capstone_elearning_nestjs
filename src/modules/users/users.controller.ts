import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Query,
  Patch,
  ValidationPipe,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create-user')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get('')
  async findAll() {
    return this.usersService.findAll();
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard) // Only GV
  async deleteUser(@Param('id') id: number) {
    return this.usersService.deleteUser(+id);
  }

  @Get('get-user-pagination')
  async getPaginatedUsers(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.usersService.getPaginatedUsers(page, pageSize);
  }

  @Get('search-user')
  search(@Query('tuKhoa') tuKhoa: string) {
    return this.usersService.searchUser(tuKhoa);
  }

  @Patch(':id')
  async updateUser(@Body(ValidationPipe) updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(updateUserDto);
  }
}
