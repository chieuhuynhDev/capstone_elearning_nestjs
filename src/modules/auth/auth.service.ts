import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';

import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(dto: LoginDto) {
    // Tìm theo username hoặc email
    const user = await this.prisma.users.findFirst({
      where: {
        OR: [{ username: dto.username }, { email: dto.username }],
      },
      include: { userTypes: true },
    });

    // So sánh password thuần
    if (!user || user.password !== dto.password) {
      throw new UnauthorizedException('Tài khoản hoặc mật khẩu không đúng');
    }

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        userType: user.userTypes.userTypeCode,
      },
    };
  }

  async register(dto: RegisterDto) {
    const existed = await this.prisma.users.findFirst({
      where: {
        OR: [{ username: dto.username }, { email: dto.email }],
      },
    });

    if (existed) {
      throw new BadRequestException('Tài khoản hoặc email đã tồn tại');
    }

    const userType = await this.prisma.userTypes.findUnique({
      where: { userTypeCode: 'HV' },
    });

    if (!userType)
      throw new BadRequestException('Loại người dùng HV không tồn tại');

    const user = await this.prisma.users.create({
      data: {
        ...dto,
        userTypeId: userType.id,
      },
    });

    // Xoá trường password khỏi kết quả trả về
    const { password, ...result } = user;
    return result;
  }
}
