import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEmail, IsNumber } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Nguyễn Văn Mới', required: false })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({ example: 987654321, required: false })
  @IsOptional()
  @IsNumber()
  phoneNumber?: number;

  @ApiProperty({ example: 'emailmoi@example.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;
}
