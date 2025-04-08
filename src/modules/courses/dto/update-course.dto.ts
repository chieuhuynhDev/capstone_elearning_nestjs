import {
  IsInt,
  IsString,
  IsOptional,
  IsNotEmpty,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCourseDto {
  @ApiProperty({ description: 'ID of the course to update', example: 1 })
  @IsInt()
  @IsNotEmpty()
  id: number;

  @ApiProperty({
    description: 'Course code (unique)',
    example: 'CS101',
    required: false,
  })
  @IsString()
  @IsOptional()
  courseCode?: string;

  @ApiProperty({
    description: 'Alias of the course',
    example: 'intro-cs',
    required: false,
  })
  @IsString()
  @IsOptional()
  alias?: string;

  @ApiProperty({
    description: 'Course name',
    example: 'Introduction to Computer Science',
    required: false,
  })
  @IsString()
  @IsOptional()
  courseName?: string;

  @ApiProperty({
    description: 'Title of the course',
    example: 'Intro to CS',
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'Course description',
    example: 'This course covers the basics of computer science.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Image URL of the course',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    description: 'Created date of the course',
    example: '2025-04-03T10:00:00.000Z',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  createdDate?: string;

  @ApiProperty({
    description: 'Category ID of the course',
    example: 1,
    required: false,
  })
  @IsInt()
  @IsOptional()
  categoryId?: number;
}
