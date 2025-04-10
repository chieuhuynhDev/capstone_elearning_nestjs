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
import CourseService from './courses.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import uploadLocal from 'src/common/multer/local.multer';

@Controller(`course`)
export default class CourseController {
  constructor(public courseServie: CourseService) {}

  @Get(`course-list`)
  async getAllCourses() {
    const result = await this.courseServie.getAllCourses();
    return result;
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

  @Post()
  @ApiOperation({ summary: 'Create new course' })
  createCourse(@Body() dto: CreateCourseDto) {
    return this.courseServie.addCourse(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update course' })
  updateCourse(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return this.courseServie.updateCourse(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete course' })
  deleteCourse(@Param('id') id: string) {
    return this.courseServie.deleteCourse(+id);
  }

  @Post('upload-image')
  @ApiOperation({ summary: 'Upload image & update course' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        courseId: { type: 'integer', example: 5 },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', uploadLocal))
  uploadCourseImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('courseId') courseId: string,
  ) {
    return this.courseServie.uploadCourseImage(file, +courseId);
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
}
