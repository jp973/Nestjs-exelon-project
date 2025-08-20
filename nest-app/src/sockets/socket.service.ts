// src/sockets/socket.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Socket } from 'socket.io';
import { AuthenticatedSocket, SocketResponse } from './interfaces/socket.interface';
import { Token } from '../auth/schemas/token.schema';

@Injectable()
export class SocketService {
  private readonly logger = new Logger(SocketService.name);
  private connectedClients: Map<string, AuthenticatedSocket> = new Map();

  constructor(
    @InjectModel(Token.name) private tokenModel: Model<Token>,
  ) {}

  async handleConnection(client: AuthenticatedSocket): Promise<void> {
    try {
      this.connectedClients.set(client.user.userId, client);
      this.logger.log(`Client connected: ${client.user.email}`);
      
      // Join user to their personal room
      client.join(`user_${client.user.userId}`);
      
      // Join user to role-based room
      client.join(`role_${client.user.role}`);
      
      this.emitToUser(client.user.userId, 'connection_success', {
        message: 'Connected successfully',
        userId: client.user.userId,
      });
    } catch (error) {
      this.logger.error('Connection error:', error);
      client.emit('connection_error', { error: 'Connection failed' });
    }
  }

  handleDisconnect(client: AuthenticatedSocket): void {
    this.connectedClients.delete(client.user.userId);
    this.logger.log(`Client disconnected: ${client.user.email}`);
  }

  // Emit to specific user
  emitToUser(userId: string, event: string, data: any): void {
    const client = this.connectedClients.get(userId);
    if (client) {
      client.emit(event, this.createResponse('success', data));
    }
  }

  // Emit to all users in a room
  emitToRoom(room: string, event: string, data: any): void {
    const clients = Array.from(this.connectedClients.values());
    clients.forEach(client => {
      if (client.rooms.has(room)) {
        client.emit(event, this.createResponse('success', data));
      }
    });
  }

  // Emit to all connected clients
  emitToAll(event: string, data: any): void {
    this.connectedClients.forEach(client => {
      client.emit(event, this.createResponse('success', data));
    });
  }

  // Broadcast to all except sender
  broadcastToAllExcept(senderId: string, event: string, data: any): void {
    this.connectedClients.forEach((client, userId) => {
      if (userId !== senderId) {
        client.emit(event, this.createResponse('success', data));
      }
    });
  }

  private createResponse<T>(status: 'success' | 'error', data?: T, message?: string): SocketResponse<T> {
    return {
      status,
      data,
      message,
    };
  }

  getConnectedUsers(): string[] {
    return Array.from(this.connectedClients.keys());
  }

  isUserConnected(userId: string): boolean {
    return this.connectedClients.has(userId);
  }
}