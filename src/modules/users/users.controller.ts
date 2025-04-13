import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Query,
  Patch,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ChangePasswordDto } from './dto/change-password.dto';

import { createMulterConfig } from 'src/common/multer/local.multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadAvatarDto } from './dto/upload-avatar.dto';

@ApiTags('User')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('')
  async findAll() {
    return this.usersService.findAll();
  }

  @Get('roles')
  @ApiOperation({ summary: 'Get list usertype' })
  getUserRoles() {
    return this.usersService.getUserRoles();
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
  @Get('profile/:username')
  @ApiOperation({ summary: 'Get user profile by username' })
  getProfile(@Param('username') username: string) {
    return this.usersService.getUserProfile(username);
  }

  @Get(':username/unregistered-courses')
  @ApiOperation({ summary: 'List unregistered courses by username' })
  getCoursesUserNotEnrolled(@Param('username') username: string) {
    return this.usersService.getCoursesUserNotEnrolled(username);
  }

  @Post('create-user')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Post('upload-avatar')
  @ApiOperation({ summary: 'Upload avatar for user' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', createMulterConfig('avatars', 'avatar')),
  )
  uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadAvatarDto: UploadAvatarDto,
  ) {
    return this.usersService.uploadAvatar(file, uploadAvatarDto.username);
  }

  @Patch('change-password')
  @ApiOperation({ summary: 'Change password for user' })
  changePassword(@Body() dto: ChangePasswordDto) {
    console.log('dto', dto);

    return this.usersService.changePassword(dto);
  }
  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  async updateUser(@Body() updateUserDto: UpdateUserDto) {
    console.log('updateUserDto', updateUserDto);
    return this.usersService.updateUser(updateUserDto);
  }

  @Delete(':id')
  // @UseGuards(JwtAuthGuard, RolesGuard) // Only GV
  async deleteUser(@Param('id') id: number) {
    return this.usersService.deleteUser(+id);
  }
}
