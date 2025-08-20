// src/sockets/events/notification.events.ts
import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { SocketAuth } from '../decorators/socket-auth.decorator';
import { SocketService } from '../socket.service';
import * as socketInterface from '../interfaces/socket.interface';

@WebSocketGateway()
export class NotificationEventsGateway {
  constructor(private socketService: SocketService) {}

  @SubscribeMessage('subscribe_notifications')
  @SocketAuth()
  handleSubscribeNotifications(client: socketInterface.AuthenticatedSocket) {
    // User is automatically subscribed to their personal room
    return {
      status: 'success',
      message: 'Subscribed to notifications',
    };
  }

  @SubscribeMessage('mark_notification_read')
  @SocketAuth()
  handleMarkNotificationRead(
    client: socketInterface.AuthenticatedSocket,
    @MessageBody() data: { notificationId: string },
  ) {
    // Handle marking notification as read
    return {
      status: 'success',
      message: 'Notification marked as read',
    };
  }
}   