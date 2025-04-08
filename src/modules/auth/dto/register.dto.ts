import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsNumber,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'nguyenvana' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 987654321 })
  @IsNotEmpty()
  @IsNumber()
  phoneNumber: number;

  @ApiProperty({ example: 'nguyenvana@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
