// src/sockets/socket.gateway.ts
import { 
  WebSocketGateway, 
  WebSocketServer, 
  OnGatewayConnection, 
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseFilters } from '@nestjs/common';
import { SocketAuthMiddleware } from './middleware/socket-auth.middleware';
import { SocketService } from './socket.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as socketInterface from './interfaces/socket.interface';
import { WsExceptionFilter } from '../sockets/filters/ws-exception.filter';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: 'api',
})
@UseFilters(new WsExceptionFilter())
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(SocketGateway.name);

  constructor(
    private socketService: SocketService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  afterInit(server: Server) {
    const authMiddleware = new SocketAuthMiddleware(this.jwtService, this.configService);
    server.use((socket: socketInterface.AuthenticatedSocket, next) => {
      authMiddleware.use(socket, next);
    });

    this.logger.log('Socket server initialized');
  }

  async handleConnection(client: socketInterface.AuthenticatedSocket) {
    try {
      await this.socketService.handleConnection(client);
    } catch (error) {
      this.logger.error('Connection failed:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: socketInterface.AuthenticatedSocket) {
    this.socketService.handleDisconnect(client);
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: socketInterface.AuthenticatedSocket) {
    return {
      status: 'success',
      data: { pong: Date.now(), userId: client.user.userId },
    };
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(
    @ConnectedSocket() client: socketInterface.AuthenticatedSocket,
    @MessageBody() data: { room: string },
  ) {
    client.join(data.room);
    return {
      status: 'success',
      message: `Joined room: ${data.room}`,
    };
  }

  @SubscribeMessage('leave_room')
  handleLeaveRoom(
    @ConnectedSocket() client: socketInterface.AuthenticatedSocket,
    @MessageBody() data: { room: string },
  ) {
    client.leave(data.room);
    return {
      status: 'success',
      message: `Left room: ${data.room}`,
    };
  }
}