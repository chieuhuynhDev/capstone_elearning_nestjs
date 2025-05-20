import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';

import { LoginDto } from './dto/login.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import {
  comparePasswordHelper,
  hashPasswordHelper,
} from 'src/common/helpers/ultil';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    // Tìm theo username hoặc email
    const userExists = await this.prisma.users.findFirst({
      where: {
        OR: [{ username: dto.username }, { email: dto.username }],
      },
      include: { userTypes: true },
    });

    if (!userExists) {
      throw new BadRequestException('Tài khoản chưa tồn tại. Vui lòng đăng ký');
    }

    // So sánh password
    const isPasswordValid = await comparePasswordHelper(
      dto.password,
      userExists.password,
    );
    if (!isPasswordValid) {
      throw new BadRequestException('Mât khẩu không chính xác');
    }

    const payload = { sub: userExists.id, username: userExists.username };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken: accessToken,
      refreshToken: 'chưa tạo',
    };

    //   user: {
    //     id: user.id,
    //     username: user.username,
    //     email: user.email,
    //     fullName: user.fullName,
    //     userType: user.userTypes.userTypeCode,
    //   },
    // };
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

    // hash password
    const hashedPassword = await hashPasswordHelper(dto.password);

    const user = await this.prisma.users.create({
      data: {
        ...dto,
        password: hashedPassword,
        userTypeId: userType.id,
      },
    });

    // Xoá trường password khỏi kết quả trả về
    const { password, ...result } = user;
    return result;
  }
}
