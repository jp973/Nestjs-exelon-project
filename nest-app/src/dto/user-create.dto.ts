// src/users/dto/user-create.dto.ts
import { 
  IsEmail, 
  IsNotEmpty, 
  IsString, 
  MinLength, 
  IsBoolean, 
  IsIn, 
  IsInt, 
  Min, 
  Max,
  IsEnum
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the user',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
    required: true
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'SecurePassword123!',
    description: 'User password (min 8 characters)',
    minLength: 8,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({
    example: true,
    description: 'Marital status of the user',
    required: true
  })
  @IsBoolean()
  @IsNotEmpty()
  ismarried: boolean;

  @ApiProperty({
    example: 'male',
    description: 'Gender of the user',
    enum: ['male', 'female', 'other'],
    required: true
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(['male', 'female', 'other'])
  gender: string;

  @ApiProperty({
    example: 25,
    description: 'Age of the user (18-100)',
    minimum: 18,
    maximum: 100,
    required: true
  })
  @IsInt()
  @Min(18)
  @Max(100)
  age: number;
}