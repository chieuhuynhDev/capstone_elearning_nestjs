import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import PrismaModule from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRED,
} from '../../common/constant/app.constant';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: ACCESS_TOKEN_EXPIRED },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
