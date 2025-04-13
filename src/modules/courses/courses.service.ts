import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export default class CourseService {
  constructor(private prisma: PrismaService) {}

  async getAllCourses() {
    const courses = await this.prisma.courses.findMany({
      select: {
        courseCode: true,
        alias: true,
        courseName: true,
        description: true,
        views: true,
        imageUrl: true,
        createdDate: true,
        studentCount: true,
        CourseCategories: {
          select: {
            categoryCode: true,
            categoryName: true,
          },
        },
        creator: {
          select: {
            fullName: true,
            phoneNumber: true,
            userTypes: {
              select: {
                userTypeCode: true,
                userTypeName: true,
              },
            },
          },
        },
      },
    });
    return courses;
  }

  async getCourseById(courseCode: string) {
    const course = await this.prisma.courses.findUnique({
      where: { courseCode },
      include: {
        CourseCategories: {
          select: { categoryCode: true, categoryName: true },
        },
        creator: {
          select: {
            username: true,
            fullName: true,
            email: true,
            userTypes: {
              select: {
                userTypeCode: true,
                userTypeName: true,
              },
            },
          },
        },
      },
    });

    if (!course) throw new NotFoundException('Course not found');
    return course;
  }

  async getCoursesByPagination(page: number, pageSize: number) {
    const [data, total] = await Promise.all([
      this.prisma.courses.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          CourseCategories: true,
          creator: true,
        },
      }),
      this.prisma.courses.count(),
    ]);
    return {
      data,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async addCourse(dto: CreateCourseDto) {
    const existed = await this.prisma.courses.findUnique({
      where: { courseCode: dto.courseCode },
    });

    if (existed) {
      throw new BadRequestException('Mã khóa học đã tồn tại');
    }

    return this.prisma.courses.create({ data: dto });
  }

  // cập nhật khóa học
  async updateCourse(id: number, dto: UpdateCourseDto) {
    const existed = await this.prisma.courses.findUnique({ where: { id } });
    if (!existed) throw new NotFoundException('Khóa học không tồn tại');

    return this.prisma.courses.update({
      where: { id },
      data: dto,
    });
  }

  // xóa khóa học
  async deleteCourse(id: number) {
    const existed = await this.prisma.courses.findUnique({ where: { id } });
    if (!existed) throw new NotFoundException('Khóa học không tồn tại');

    return this.prisma.courses.delete({ where: { id } });
  }

  // upload ảnh khóa học
  async uploadCourseImage(file: Express.Multer.File, courseCode: string) {
    if (!file) throw new BadRequestException('No file uploaded');
    if (!courseCode) throw new BadRequestException('courseCode is required');

    const imageUrl = `/images/courses/${file.filename}`;

    const course = await this.prisma.courses.findUnique({
      where: { courseCode },
    });
    if (!course) throw new NotFoundException('Course not found');

    await this.prisma.courses.update({
      where: { courseCode },
      data: { imageUrl },
    });

    return {
      message: 'Image uploaded successfully',
      imageUrl,
      updatedCourseId: courseCode,
    };
  }

  // lấy danh mục khóa học
  async getCourseCategories() {
    return this.prisma.courseCategories.findMany({
      select: {
        categoryCode: true,
        categoryName: true,
      },
    });
  }

  // lấy danh sách khóa học theo danh mục
  async getCoursesByCategory(categoryCode: string) {
    // Tìm danh mục theo mã
    const category = await this.prisma.courseCategories.findUnique({
      where: { categoryCode },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    // Lấy danh sách khóa học theo categoryId
    const courses = await this.prisma.courses.findMany({
      where: { categoryId: category.id },
      include: {
        creator: {
          select: {
            username: true,
            fullName: true,
            userTypes: {
              select: {
                userTypeCode: true,
                userTypeName: true,
              },
            },
          },
        },
        CourseCategories: {
          select: {
            categoryCode: true,
            categoryName: true,
          },
        },
      },
    });

    return courses;
  }

  // tìm kiếm khóa học theo tên, alias hoặc mã khóa học
  async searchCourses(keyword: string) {
    console.log(keyword);

    return this.prisma.courses.findMany({
      where: {
        OR: [
          { courseName: { contains: keyword } },
          { alias: { contains: keyword } },
          { courseCode: { contains: keyword } },
        ],
      },
      include: {
        CourseCategories: {
          select: { categoryCode: true, categoryName: true },
        },
        creator: {
          select: {
            username: true,
            fullName: true,
          },
        },
      },
    });
  }
}
