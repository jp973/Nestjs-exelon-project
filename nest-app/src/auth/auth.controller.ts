// src/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, Req, Res } from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

import {
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LoginDto } from '../dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      example: {
        statusCode: 200,
        message: 'Login successful',
        data: {
          role: 'admin',
          access_token: 'jwt_access_token_here',
          refresh_token: 'jwt_refresh_token_here',
        },
      },
    },
  })
  async login(@Req() req, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.login(req.user);

    // Set cookies
    res.cookie('access_token', tokens.access_token, {
      httpOnly: true,
      secure: false, // change to true in production with HTTPS
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    return {
      statusCode: 200,
      message: 'Login successful',
      data: {
        role: req.user.role,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
      },
    };
  }

  @ApiBearerAuth('JWT-auth')
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return { statusCode: 200, message: 'Logged out successfully' };
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: 'New access token issued',
    schema: {
      example: {
        statusCode: 200,
        message: 'Token refreshed',
        data: {
          access_token: 'new_access_token_here',
        },
      },
    },
  })
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) {
      return { statusCode: 401, message: 'Refresh token missing' };
    }

    const newAccess = await this.authService.refresh(refreshToken);

    // Set new access token cookie
    res.cookie('access_token', newAccess.access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return {
      statusCode: 200,
      message: 'Token refreshed',
      data: {
        access_token: newAccess.access_token,
      },
    };
  }
}