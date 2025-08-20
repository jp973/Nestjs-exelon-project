// nest-app/src/app.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(@InjectConnection() private connection: Connection) {}

  getHello(): string {
    this.logger.log(`MongoDB connection state: ${this.connection.readyState}`);
    return 'Hello World!';
  }

  checkDBConnection(): { status: string, readyState: number } {
    const isConnected = this.connection.readyState === 1;
    return {
      status: isConnected ? 'connected' : 'disconnected',
      readyState: this.connection.readyState
    };
  }
}