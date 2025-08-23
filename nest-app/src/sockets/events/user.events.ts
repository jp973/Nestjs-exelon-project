// src/sockets/events/user.events.ts
import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SocketAuth } from '../decorators/socket-auth.decorator';
import { SocketRoles } from '../decorators/socket-roles.decorator';
import { SocketService } from '../socket.service';
import * as socketInterface from '../interfaces/socket.interface';

@WebSocketGateway()
export class UserEventsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private socketService: SocketService) {}

  @SubscribeMessage('user_typing')
  @SocketAuth()
  handleUserTyping(
    client: socketInterface.AuthenticatedSocket,
    @MessageBody() data: { chatId: string; isTyping: boolean },
  ) {
    // Broadcast typing status to chat room
    this.server.to(`chat_${data.chatId}`).emit('user_typing', {
      userId: client.user.userId,
      isTyping: data.isTyping,
    });
  }

  @SubscribeMessage('user_online_status')
  @SocketAuth()
  handleUserOnlineStatus(client: socketInterface.AuthenticatedSocket) {
    return {
      status: 'success',
      data: { online: true, userId: client.user.userId },
    };
  }

  @SubscribeMessage('get_online_users')
  @SocketAuth()
  @SocketRoles('admin')
  handleGetOnlineUsers() {
    const onlineUsers = this.socketService.getConnectedUsers();
    return {
      status: 'success',
      data: { onlineUsers },
    };
  }
}