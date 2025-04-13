import { User } from './entities/user.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const listUser = await this.prisma.users.findMany({
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        userTypes: {
          select: {
            userTypeCode: true,
            userTypeName: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    return listUser;
  }

  async getUserRoles() {
    return this.prisma.userTypes.findMany({
      select: {
        id: true,
        userTypeCode: true,
        userTypeName: true,
      },
    });
  }

  async createUser(data: CreateUserDto) {
    const existed = await this.prisma.users.findFirst({
      where: {
        OR: [{ username: data.username }, { email: data.email }],
      },
    });

    if (existed) {
      throw new BadRequestException('Tài khoản hoặc email đã tồn tại');
    }

    return this.prisma.users.create({ data });
  }

  async searchUser(keyword: string) {
    const result = await this.prisma.users.findMany({
      where: {
        OR: [
          { username: { contains: keyword } },
          { email: { contains: keyword } },
          { fullName: { contains: keyword } },
        ],
      },
      include: { userTypes: true },
    });
    return result;
  }
  async deleteUser(id: number) {
    const user = await this.prisma.users.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.prisma.users.delete({
      where: { id },
    });
  }

  async updateUser(dto: UpdateUserDto) {
    const { id, fullName, phoneNumber, email } = dto;

    const existingUser = await this.prisma.users.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException('Người dùng không tồn tại');
    }

    // ❗ Nếu email thay đổi → kiểm tra có bị trùng không
    if (email && email !== existingUser.email) {
      const emailExisted = await this.prisma.users.findFirst({
        where: {
          email,
          NOT: { id },
        },
      });

      if (emailExisted) {
        throw new BadRequestException('Email đã được sử dụng bởi người khác');
      }
    }

    const updatedUser = await this.prisma.users.update({
      where: { id },
      data: {
        fullName,
        phoneNumber,
        email,
      },
    });

    const { password: _, ...result } = updatedUser;
    return result;
  }

  async getPaginatedUsers(page: number, pageSize: number) {
    const totalUsers = await this.prisma.users.count();
    const totalPage = Math.ceil(totalUsers / pageSize);

    const users = await this.prisma.users.findMany({
      skip: (page - 1) * pageSize,
      take: +pageSize,
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        userTypes: {
          select: {
            userTypeCode: true,
            userTypeName: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      page,
      pageSize,
      totalPage,
      totalUsers,
      data: users || [],
    };
  }

  async getUserProfile(username: string) {
    const user = await this.prisma.users.findUnique({
      where: { username },
      select: {
        username: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        userTypes: {
          select: {
            userTypeCode: true,
            userTypeName: true,
          },
        },
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async changePassword(dto: ChangePasswordDto) {
    console.log('changePassword', dto);

    const { username, oldPassword, newPassword } = dto;

    const user = await this.prisma.users.findUnique({ where: { username } });
    if (!user) throw new NotFoundException('User not found');

    if (user.password !== oldPassword) {
      throw new BadRequestException('Old password is incorrect');
    }

    const updated = await this.prisma.users.update({
      where: { username },
      data: { password: newPassword },
    });

    return { message: 'Password updated successfully' };
  }

  async uploadAvatar(file: Express.Multer.File, username: string) {
    if (!file) throw new BadRequestException('No file uploaded');

    const user = await this.prisma.users.findUnique({
      where: { username },
    });

    if (!user) throw new NotFoundException('User not found');
    const avatarUrl = `/images/avatars/${file.filename}`;
    await this.prisma.users.update({
      where: { username },
      data: { avatar: avatarUrl },
    });
    return {
      message: 'Avatar updated successfully',
      avatarUrl,
    };
  }

  async getCoursesUserNotEnrolled(username: string) {
    const user = await this.prisma.users.findUnique({ where: { username } });
    if (!user) throw new NotFoundException('User not found');

    const enrolledCourses = await this.prisma.enrollment.findMany({
      where: { userId: user.id },
      select: { courseId: true },
    });

    const courseIds = enrolledCourses.map((e) => e.courseId);

    const unregisteredCourses = await this.prisma.courses.findMany({
      where: {
        id: { notIn: courseIds },
      },
      select: {
        id: true,
        courseCode: true,
        courseName: true,
        imageUrl: true,
      },
    });

    return {
      username,
      unregisteredCourses,
    };
  }
}
