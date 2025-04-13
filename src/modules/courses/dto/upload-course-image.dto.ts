import { ApiProperty } from '@nestjs/swagger';

export class UploadCourseImageDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;

  @ApiProperty({ example: 'JS01' })
  courseCode: string;
}
