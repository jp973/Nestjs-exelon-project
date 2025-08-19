//nest-app\src\users\users.service.ts
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from '../dto/user-create.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword
    });
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

 async findOne(id: string): Promise<User | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BadRequestException('Invalid user ID');
  }
  return this.userModel.findById(id).exec();
}

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BadRequestException('Invalid user ID');
  }
  const user = await this.userModel
    .findByIdAndUpdate(id, updateUserDto, { new: true })
    .exec();
  if (!user) {
    throw new NotFoundException('User not found');
  }
  return user;
}

async remove(id: string): Promise<User> {
  const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
  if (!deletedUser) {
    throw new Error('User not found');
  }
  return deletedUser;
}

async findByEmail(email: string): Promise<User | null> {
  return this.userModel.findOne({ email }).exec();
}
}