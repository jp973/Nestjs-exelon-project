// import { Controller, Get, OnModuleInit, Query } from '@nestjs/common';
// import { ClientProxy, ClientProxyFactory, Transport, MessagePattern, Payload } from '@nestjs/microservices';
// import { lastValueFrom } from 'rxjs';

// @Controller()
// export class AppController implements OnModuleInit {
//   private client: ClientProxy;

//   constructor() {
//     this.client = ClientProxyFactory.create({
//       transport: Transport.RMQ,
//       options: {
//         urls: ['amqp://localhost:5672'],
//         queue: 'test_queue',
//         queueOptions: { durable: false },
//       },
//     });
//   }

//   async onModuleInit() {
//     await this.client.connect();
//   }

//   // HTTP → produces message
//   @Get('send')
//   async sendMessage(@Query('name') name: string) {
//     const value = name || 'Guest';
//     return lastValueFrom(this.client.send('hello', value));
//   }

//   // RMQ → consumes message
//   @MessagePattern('hello')
//   getHello(@Payload() data: string): string {
//     return `Hello, ${data}`;
//   }
// }
