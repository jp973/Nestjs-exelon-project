// src/sockets/socket.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';
import { UserEventsGateway } from './events/user.events';
import { NotificationEventsGateway } from './events/notification.events';
import { Token, TokenSchema } from '../auth/schemas/token.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    SocketGateway,
    SocketService,
    UserEventsGateway,
    NotificationEventsGateway,
  ],
  exports: [SocketService],
})
export class SocketModule {}