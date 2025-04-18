import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsNumber,
  IsInt,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'admin123' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: 'Nguyễn Văn B' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 987654321 })
  @IsNotEmpty()
  @IsNumber()
  phoneNumber: number;

  @ApiProperty({ example: 'admin@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User type ID (1 for GV, 2 for HV)', example: 1 })
  @IsNotEmpty()
  @IsInt()
  userTypeId: number;
}
