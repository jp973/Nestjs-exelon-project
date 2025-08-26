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
  ) {}

  /**
   * Validate user credentials
   */
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  /**
   * Login → issue access + refresh token
   */
  async login(user: User & { _id: Types.ObjectId }) {
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    };

    // Access token valid for 1 day
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1d' });

    // Refresh token valid for 30 days
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });

    // 🔥 Remove old tokens for this user
    await this.tokenModel.deleteMany({ userId: user._id });

    // Save new token pair in DB
    await this.tokenModel.create({
      userId: user._id,
      accessToken,
      refreshToken,
      role: user.role,
      isActive: true,
      expiresAt: new Date(Date.now() + 24 * 3600 * 1000), // 1 day
      refreshExpiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000), // 30 days
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  /**
   * Logout → remove tokens from DB
   */
  async logout(token: string) {
    const result = await this.tokenModel.findOneAndDelete({
      $or: [{ accessToken: token }, { refreshToken: token }],
    });

    if (!result) {
      throw new UnauthorizedException('Invalid token or already logged out');
    }

    return { message: 'Logged out successfully' };
  }

  /**
   * Refresh → generate new access token using refresh token
   */
  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token required');
    }

    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken);

      // Ensure refresh token exists in DB and is active
      const tokenDoc = await this.tokenModel.findOne({
        refreshToken,
        isActive: true,
      });

      if (!tokenDoc) {
        throw new UnauthorizedException('Refresh token not found');
      }

      if (tokenDoc.refreshExpiresAt < new Date()) {
        throw new UnauthorizedException('Refresh token expired');
      }

      // Issue new access token (1 day)
      const newAccessToken = this.jwtService.sign(
        { sub: payload.sub, email: payload.email, role: payload.role },
        { expiresIn: '1d' },
      );

      // Update access token in DB
      tokenDoc.accessToken = newAccessToken;
      tokenDoc.expiresAt = new Date(Date.now() + 24 * 3600 * 1000);
      await tokenDoc.save();

      return {
        access_token: newAccessToken,
      };
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
