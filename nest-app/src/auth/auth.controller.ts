// src/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, Req, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ApiBody, ApiOperation, ApiResponse, ApiTags, ApiHeader, ApiBearerAuth } from '@nestjs/swagger';
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
          access_token: 'eyJhbGciOi...',
          role: 'admin'
        }
      }
    }
  })
  async login(@Req() req) {
    const token = await this.authService.login(req.user);
    return {
      statusCode: 200,
      message: 'Login successful',
      data: {
        ...token,
        role: req.user.role
      }
    };
  }

    
@ApiBearerAuth('JWT-auth')
@Post('logout')
@UseGuards(JwtAuthGuard)
@ApiOperation({ summary: 'User logout' })
@ApiResponse({ status: 200, description: 'Logout successful' })
async logout(@Req() req) {
  const token = req.headers['authorization']?.split(' ')[1];
  await this.authService.logout(token);
  return { statusCode: 200, message: 'Logged out successfully' };
}

}