// src/users/dto/user-create.dto.ts
import { IsEmail, IsNotEmpty, IsString, MinLength, IsBoolean, IsIn, IsInt, Min, Max } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsBoolean()
  @IsNotEmpty()
  ismarried: boolean;

  @IsString()
  @IsNotEmpty()
  @IsIn(['male', 'female', 'other'])
  gender: string;

  @IsInt()
  @Min(18)
  @Max(100)
  age: number;
}