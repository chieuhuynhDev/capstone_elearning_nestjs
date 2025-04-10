import { Injectable } from '@nestjs/common';
import { EnrollCourseDto } from './dto/enroll-course.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EnrollmentService {
  constructor(private prisma: PrismaService) {}

  async enrollCourse(dto: EnrollCourseDto) {
    return `This action enrolls a course`;
  }
  findAll() {
    return `This action returns all enrollment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} enrollment`;
  }

  // update(id: number, updateEnrollmentDto: UpdateEnrollmentDto) {
  //   return `This action updates a #${id} enrollment`;
  // }

  remove(id: number) {
    return `This action removes a #${id} enrollment`;
  }
}
