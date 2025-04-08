import { User } from './entities/user.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

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
}
