import { Injectable, NotFoundException } from '@nestjs/common';
import { EnrollCourseDto } from './dto/enroll-course.dto';
import { PrismaService } from '../prisma/prisma.service';
import { ApproveEnrollmentDto } from './dto/approve-enrollment.dto';
import { CancelEnrollmentDto } from './dto/cancle-enrollment.dto';

@Injectable()
export class EnrollmentService {
  constructor(private prisma: PrismaService) {}

  async enrollCourse(dto: EnrollCourseDto) {
    const { courseCode, username } = dto;
    const course = await this.prisma.courses.findUnique({
      where: { courseCode: courseCode },
    });
    const user = await this.prisma.users.findUnique({
      where: { username: username },
    });

    if (!course || !user)
      throw new NotFoundException('Course or user not found');

    const existed = await this.prisma.enrollment.findFirst({
      where: { courseId: course.id, userId: user.id },
    });

    if (existed)
      throw new NotFoundException('User already enrolled in this course');

    const result = await this.prisma.enrollment.create({
      data: {
        userId: user.id,
        courseId: course.id,
        status: 'pending',
      },
    });

    return {
      message: 'Enrollment successful',
      enrollment: result,
    };

    return { course, user, existed };
  }
  async getStudentByCourseId(courseId: string) {
    const course = await this.prisma.courses.findUnique({
      where: { courseCode: courseId },
    });

    if (!course) throw new NotFoundException('Course not found');

    const enrollments = await this.prisma.enrollment.findMany({
      where: { courseId: course.id },
      include: {
        user: {
          select: {
            username: true,
            email: true,
            fullName: true,
            phoneNumber: true,
          },
        },
      },
    });

    return {
      courseCode: course.courseCode,

      student: enrollments.map((enrollment) => ({
        username: enrollment.user.username,
        email: enrollment.user.email,
        fullName: enrollment.user.fullName,
        phoneNumber: enrollment.user.phoneNumber,
        status: enrollment.status,
      })),
    };
  }

  async approveEnrollment(dto: ApproveEnrollmentDto) {
    const { courseCode, username } = dto;
    const course = await this.prisma.courses.findUnique({
      where: { courseCode: courseCode },
    });
    const user = await this.prisma.users.findUnique({
      where: { username: username },
    });

    if (!course || !user)
      throw new NotFoundException('Course or user not found');

    const existed = await this.prisma.enrollment.findFirst({
      where: { courseId: course.id, userId: user.id },
    });
    if (!existed) throw new NotFoundException('Enrollment not found');

    await this.prisma.enrollment.update({
      where: { id: existed.id },
      data: { status: 'approved' },
    });

    return {
      message: 'Enrollment approved successfully',
    };
  }

  async cancelEnrollment(dto: CancelEnrollmentDto) {
    const { courseCode, username } = dto;
    const course = await this.prisma.courses.findUnique({
      where: { courseCode: courseCode },
    });
    const user = await this.prisma.users.findUnique({
      where: { username: username },
    });

    if (!course || !user)
      throw new NotFoundException('Course or user not found');

    const existed = await this.prisma.enrollment.findFirst({
      where: { courseId: course.id, userId: user.id },
    });
    if (!existed) throw new NotFoundException('Enrollment not found');

    await this.prisma.enrollment.delete({
      where: { id: existed.id },
    });

    return {
      message: 'Enrollment canceled successfully',
    };
  }

  async getCoursesByUser(username: string) {
    const user = await this.prisma.users.findUnique({
      where: { username },
    });

    if (!user) throw new NotFoundException('User not found');

    const enrollments = await this.prisma.enrollment.findMany({
      where: { userId: user.id },
      include: {
        course: {
          select: {
            courseCode: true,
            courseName: true,
            imageUrl: true,
          },
        },
      },
    });

    return {
      username: user.username,
      courses: enrollments.map((e) => ({
        status: e.status,
        enrolledAt: e.createdAt,
        course: e.course,
      })),
    };
  }

  async getPendingEnrollments(courseCode: string) {
    const course = await this.prisma.courses.findUnique({
      where: { courseCode },
    });
    if (!course) throw new NotFoundException('Course not found');

    const enrollments = await this.prisma.enrollment.findMany({
      where: { courseId: course.id, status: 'pending' },
      include: {
        user: {
          select: {
            username: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    return {
      courseCode: course.courseCode,
      pendingEnrollments: enrollments.map((e) => ({
        username: e.user.username,
        fullName: e.user.fullName,
        email: e.user.email,
        enrolledAt: e.createdAt,
      })),
    };
  }

  async getUsersNotEnrolled(courseCode: string) {
    const course = await this.prisma.courses.findUnique({
      where: { courseCode },
    });
    if (!course) throw new NotFoundException('Course not found');

    // Lấy danh sách userId đã ghi danh
    const enrolled = await this.prisma.enrollment.findMany({
      where: { courseId: course.id },
      select: { userId: true },
    });

    const enrolledUserIds = enrolled.map((e) => e.userId);

    // Lấy user chưa có trong danh sách trên
    const unregisteredUsers = await this.prisma.users.findMany({
      where: {
        id: { notIn: enrolledUserIds },
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
      },
    });
    return {
      courseCode,
      unregisteredUsers,
    };
  }
}
