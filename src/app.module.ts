import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import CoursesModule from './modules/courses/courses.module';
import PrismaModule from './modules/prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';

@Global()
@Module({
  imports: [ConfigModule.forRoot(), CoursesModule, PrismaModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
