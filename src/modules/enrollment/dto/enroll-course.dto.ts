import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class EnrollCourseDto {
  @ApiProperty({ example: 'JS01' })
  @IsNotEmpty()
  @IsString()
  courseCode: string;

  @ApiProperty({ example: 'student01' })
  @IsNotEmpty()
  @IsString()
  username: string;
}
