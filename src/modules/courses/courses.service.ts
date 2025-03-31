import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
}
