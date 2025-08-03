import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import CoursesModule from './modules/courses/courses.module';
import PrismaModule from './modules/prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';

import { AuthModule } from './modules/auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { EnrollmentModule } from './modules/enrollment/enrollment.module';

@Global()
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..'),
    }),
    ConfigModule.forRoot(),
    CoursesModule,
    PrismaModule,
    UsersModule,
    AuthModule,
    EnrollmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
