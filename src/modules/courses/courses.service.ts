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
  async uploadCourseImage(file: Express.Multer.File, courseId?: number) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const imageUrl = `/images/${file.filename}`;

    if (courseId) {
      const course = await this.prisma.courses.findUnique({
        where: { id: courseId },
      });
      if (!course) throw new NotFoundException('Course not found');

      await this.prisma.courses.update({
        where: { id: courseId },
        data: { imageUrl },
      });

      return {
        message: 'Image uploaded and course updated',
        imageUrl,
        updatedCourseId: courseId,
      };
    }

    return {
      message: 'Image uploaded successfully',
      imageUrl,
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
}
