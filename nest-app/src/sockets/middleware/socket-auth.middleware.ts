// src/sockets/middleware/socket-auth.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';
import { AuthenticatedSocket } from '../interfaces/socket.interface';

@Injectable()
export class SocketAuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  use(socket: AuthenticatedSocket, next: (err?: Error) => void) {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization;
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const cleanToken = token.replace('Bearer ', '');
      const payload = this.jwtService.verify(cleanToken, {
        secret: this.configService.get('JWT_SECRET'),
      });

      socket.user = {
        userId: payload.sub,
        email: payload.email,
        role: payload.role,
        name: payload.name,
      };

      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  }
}