import { Controller, Get, Query } from '@nestjs/common';
import CourseService from './courses.service';

@Controller(`course`)
export default class CourseController {
  constructor(public courseServie: CourseService) {}

  @Get(`course-list`)
  async getAllCourses() {
    const result = await this.courseServie.getAllCourses();
    return result;
  }
}
