import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, IsNumber } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({})
  id: number;

  @ApiProperty({ example: 'string', required: false })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({ example: '123456789', required: false })
  @IsOptional()
  @IsNumber()
  phoneNumber?: number;

  @ApiProperty({ example: 'email@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;
}
