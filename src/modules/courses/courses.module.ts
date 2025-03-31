import { Module } from '@nestjs/common';
import CourseController from './courses.controller';
import CourseService from './courses.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [CourseController],
  providers: [CourseService, PrismaService],
})
export default class CourseModule {}
