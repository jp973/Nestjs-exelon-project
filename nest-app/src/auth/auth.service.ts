// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/schemas/user.schema';
import { Token } from './schemas/token.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectModel(Token.name) private tokenModel: Model<Token>,
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(user: User & { _id: Types.ObjectId }) {
    const payload = {
      email: user.email,
      sub: user._id.toString(),
      name: user.name,
      role: user.role
    };

    const accessToken = this.jwtService.sign(payload);

    // Store token in database
    await this.tokenModel.create({
      userId: user._id,
      token: accessToken,
      role: user.role,
      isActive: true,
      expiresAt: new Date(Date.now() + 3600 * 1000) // 1 hour expiration
    });

    return {
      access_token: accessToken,
    };
  }

  async logout(token: string) {
    // Remove the token from DB
    const result = await this.tokenModel.findOneAndDelete({ token });

    if (!result) {
      throw new UnauthorizedException('Invalid token or already logged out');
    }

    return { message: 'Logged out successfully' };
  }
}