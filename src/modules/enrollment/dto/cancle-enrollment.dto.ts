import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CancelEnrollmentDto {
  @ApiProperty({ example: 'JS01' })
  @IsNotEmpty()
  courseCode: string;

  @ApiProperty({ example: 'student01' })
  @IsNotEmpty()
  username: string;
}
