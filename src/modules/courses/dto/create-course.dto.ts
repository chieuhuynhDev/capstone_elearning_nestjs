import {
  IsString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({ description: 'Course code (unique)', example: 'CS101' })
  @IsString()
  @IsNotEmpty()
  courseCode: string;

  @ApiProperty({ description: 'Alias of the course', example: 'intro-cs' })
  @IsString()
  @IsNotEmpty()
  alias: string;

  @ApiProperty({
    description: 'Course name',
    example: 'Introduction to Computer Science',
  })
  @IsString()
  @IsNotEmpty()
  courseName: string;

  @ApiProperty({ description: 'Title of the course', example: 'Intro to CS' })
  @IsString()
  @IsNotEmpty()
  title: string;

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
  })
  @IsDateString()
  @IsNotEmpty()
  createdDate: string;

  @ApiProperty({ description: 'Category ID of the course', example: 1 })
  @IsInt()
  @IsNotEmpty()
  categoryId: number;
}
