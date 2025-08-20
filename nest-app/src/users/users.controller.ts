// nest-app\src\users\users.controller.ts
import {
  Controller, Get, Post, Body, Param, Delete, Put,
  HttpStatus, UseGuards, NotFoundException,
  BadRequestException, InternalServerErrorException
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from '../dto/user-create.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseDto } from '../dto/response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully', type: ApiResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto);
      return new ApiResponseDto(HttpStatus.CREATED, 'User created successfully', user);
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      throw new InternalServerErrorException('Failed to create user');
    }
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of all users', type: ApiResponseDto })
  async findAll() {
    try {
      const users = await this.usersService.findAll();
      return new ApiResponseDto(HttpStatus.OK, 'Users retrieved successfully', users);
    } catch (err) {
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully', type: ApiResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.usersService.findOne(id);
      if (!user) throw new NotFoundException('User not found');
      return new ApiResponseDto(HttpStatus.OK, 'User retrieved successfully', user);
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException('Failed to fetch user');
    }
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update user by id' })
  @ApiResponse({ status: 200, description: 'User updated successfully', type: ApiResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const user = await this.usersService.update(id, updateUserDto);
      if (!user) throw new NotFoundException('User not found');
      return new ApiResponseDto(HttpStatus.OK, 'User updated successfully', user);
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      if (err instanceof BadRequestException) throw err;
      throw new InternalServerErrorException('Failed to update user');
    }
  }

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by id' })
  @ApiResponse({ status: 200, description: 'User deleted successfully', type: ApiResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id') id: string) {
    try {
      const user = await this.usersService.remove(id);
      if (!user) throw new NotFoundException('User not found');
      return new ApiResponseDto(HttpStatus.OK, 'User deleted successfully', user);
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException('Failed to delete user');
    }
  }
}
