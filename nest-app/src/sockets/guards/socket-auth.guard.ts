// src/sockets/guards/socket-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { AuthenticatedSocket } from '../interfaces/socket.interface';

@Injectable()
export class SocketAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient<AuthenticatedSocket>();
    
    if (!client.user) {
      throw new WsException('Unauthorized: User not authenticated');
    }

    return true;
  }
}