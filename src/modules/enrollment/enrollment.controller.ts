import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';

import { ApiOperation } from '@nestjs/swagger';
import { EnrollCourseDto } from './dto/enroll-course.dto';
import { ApproveEnrollmentDto } from './dto/approve-enrollment.dto';
import { CancelEnrollmentDto } from './dto/cancle-enrollment.dto';

@Controller('enrollment')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get list student by courseCode ' })
  findOne(@Param('id') id: string) {
    return this.enrollmentService.getStudentByCourseId(id);
  }

  @Get('status/:username')
  @ApiOperation({ summary: 'Get all courses user enrolled in' })
  getCoursesByUser(@Param('username') username: string) {
    return this.enrollmentService.getCoursesByUser(username);
  }

  @Get(':courseCode/pending')
  @ApiOperation({ summary: 'List user pending by courseCode' })
  getPendingEnrollments(@Param('courseCode') courseCode: string) {
    return this.enrollmentService.getPendingEnrollments(courseCode);
  }

  @Get(':courseCode/unregistered-users')
  @ApiOperation({ summary: 'List unregistered users by courseCode' })
  getUsersNotEnrolled(@Param('courseCode') courseCode: string) {
    return this.enrollmentService.getUsersNotEnrolled(courseCode);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register Course' })
  enrollCourse(@Body() dto: EnrollCourseDto) {
    return this.enrollmentService.enrollCourse(dto);
  }

  @Post('approve')
  @ApiOperation({ summary: 'Approve course' })
  approveEnrollment(@Body() dto: ApproveEnrollmentDto) {
    return this.enrollmentService.approveEnrollment(dto);
  }

  @Post('cancel')
  @ApiOperation({ summary: 'Cancle course' })
  cancelEnrollment(@Body() dto: CancelEnrollmentDto) {
    return this.enrollmentService.cancelEnrollment(dto);
  }
}
