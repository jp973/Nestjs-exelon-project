// src/sockets/filters/ws-exception.filter.ts
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { SocketResponse } from '../interfaces/socket.interface';

@Catch(WsException)
export class WsExceptionFilter implements ExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();
    const response: SocketResponse = {
      status: 'error',
      error: exception.getError() as string,
    };

    client.emit('error', response);
  }
}