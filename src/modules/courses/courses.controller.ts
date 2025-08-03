import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/common/guards/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import CourseService from './courses.service';
import { ApiConsumes, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { createMulterConfig } from 'src/common/multer/local.multer';
import { UploadCourseImageDto } from './dto/upload-course-image.dto';

@Controller(`course`)
export default class CourseController {
  constructor(public courseServie: CourseService) {}

  @Get(`course-list`)
  async getAllCourses() {
    const result = await this.courseServie.getAllCourses();
    return result;
  }

  @Get('detail/:courseCode')
  @ApiOperation({ summary: 'Get course detail by courseCode' })
  getCourseById(@Param('courseCode') courseCode: string) {
    return this.courseServie.getCourseById(courseCode);
  }

  @Get('search-course')
  @ApiOperation({ summary: 'Search course by keyword (name, alias, or code)' })
  @ApiQuery({ name: 'keyword', required: true })
  searchCourses(@Query('keyword') keyword: string) {
    return this.courseServie.searchCourses(keyword);
  }

  @Get('pagination')
  @ApiOperation({ summary: 'Get paginated courses' })
  @ApiQuery({ name: 'page' })
  @ApiQuery({ name: 'pageSize' })
  getCoursesByPagination(
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.courseServie.getCoursesByPagination(+page, +pageSize);
  }

  // Lấy danh sách các khóa học theo danh mục
  @Get('categories')
  @ApiOperation({ summary: 'Get list of course categories' })
  getCourseCategories() {
    return this.courseServie.getCourseCategories();
  }

  @Get('by-category/:categoryCode')
  @ApiOperation({ summary: 'Get courses by category code (e.g. FE, BE)' })
  getCoursesByCategory(@Param('categoryCode') categoryCode: string) {
    return this.courseServie.getCoursesByCategory(categoryCode);
  }

  @Post()
  @ApiOperation({ summary: 'Create new course' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('GV')
  createCourse(@Body() dto: CreateCourseDto) {
    return this.courseServie.addCourse(dto);
  }

  @Post('upload-image')
  @ApiOperation({ summary: 'Upload course image and update' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', createMulterConfig('courses', 'course')),
  )
  uploadCourseImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadCourseImageDto,
  ) {
    return this.courseServie.uploadCourseImage(file, body.courseCode);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update course' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('GV')
  updateCourse(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return this.courseServie.updateCourse(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete course' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('GV')
  deleteCourse(@Param('id') id: string) {
    return this.courseServie.deleteCourse(+id);
  }
}
