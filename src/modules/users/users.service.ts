import { User } from './entities/user.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';

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

  async addUser(createUserDto: CreateUserDto) {
    const { username, fullName, password, phoneNumber, email, userTypeId } =
      createUserDto;

    const existingUser = await this.prisma.users.findUnique({
      where: { username },
    });
    if (existingUser) {
      throw new BadRequestException('Username already exists');
    }

    const existingEmail = await this.prisma.users.findUnique({
      where: { email },
    });
    if (existingEmail) {
      throw new BadRequestException('Email already exists');
    }

    return this.prisma.users.create({
      data: {
        username,
        fullName,
        password,
        phoneNumber,
        email,
        userTypes: {
          connect: { id: userTypeId },
        },
      },
    });
  }

  async findByUsername(username: string) {
    const user = await this.prisma.users.findUnique({
      where: { username },
      include: { userTypes: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  async deleteUser(username: string) {
    const user = await this.prisma.users.findUnique({ where: { username } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.prisma.users.delete({
      where: { username },
      select: {
        username: true,
        fullName: true,
        email: true,
      },
    });
  }

  async updateUser(id: number, data: Partial<CreateUserDto>) {
    return this.prisma.users.update({
      where: { id },
      data,
    });
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
