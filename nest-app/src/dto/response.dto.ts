// src/dto/response.dto.ts
import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T = any> {
  @ApiProperty({
    description: 'HTTP status code',
    example: HttpStatus.OK,
    type: Number,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Response message',
    example: 'Operation completed successfully',
    type: String,
  })
  message: string;

  @ApiProperty({
    description: 'Response data payload',
    required: false,
  })
  data?: T;

  @ApiProperty({
    description: 'Timestamp of the response',
    example: new Date().toISOString(),
    type: String,
  })
  timestamp: string;

  constructor(statusCode: number, message: string, data?: T) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }

  static success<T>(data: T, message = 'Success'): ApiResponseDto<T> {
    return new ApiResponseDto(HttpStatus.OK, message, data);
  }

  static created<T>(data: T, message = 'Resource created successfully'): ApiResponseDto<T> {
    return new ApiResponseDto(HttpStatus.CREATED, message, data);
  }

  static error(message: string, statusCode = HttpStatus.BAD_REQUEST): ApiResponseDto {
    return new ApiResponseDto(statusCode, message);
  }

  static notFound(message = 'Resource not found'): ApiResponseDto {
    return new ApiResponseDto(HttpStatus.NOT_FOUND, message);
  }
}