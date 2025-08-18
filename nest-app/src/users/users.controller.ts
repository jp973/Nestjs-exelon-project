import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    @Get()
    getUsers() {
        const usersService=new UsersService();
        return usersService.getAllUsers();
    }
    @Get(':id')
    getUserById(@Param('id') id: number) {
        const usersService=new UsersService();
        return usersService.getUserById(id);
    }
}