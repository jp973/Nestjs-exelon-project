// src/users/admin.seeder.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { CreateAdminDto } from '../dto/create-admin.dto';

@Injectable()
export class AdminSeederService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.seedAdmin();
  }

  private async seedAdmin() {
    const adminData: CreateAdminDto = {
      email: this.configService.get<string>('ADMIN_EMAIL') || 'admin@example.com',
      password: this.configService.get<string>('ADMIN_PASSWORD') || 'admin123',
      name: 'Admin User',
    };

    const existingAdmin = await this.userModel.findOne({ 
      email: adminData.email,
      role: 'admin' 
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminData.password, 10);
      await this.userModel.create({
        ...adminData,
        password: hashedPassword,
        role: 'admin',
      });
      console.log('Admin user created successfully');
    }
  }
}