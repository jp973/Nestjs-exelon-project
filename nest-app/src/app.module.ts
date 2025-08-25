//nest-app\src\app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SocketModule } from './sockets/socket.module';
import { StorageModule } from './storage/storage.module';
import { EmailController } from './email/email.controller';
import { SendGridService } from './email/sendgrid.service';
//import { AppController } from './app.controller';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        dbName: configService.get<string>('MONGO_DB_NAME'),
        retryAttempts: 5,
        retryDelay: 1000,
      }),
      inject: [ConfigService],
    }),

    UsersModule,
    AuthModule,
    SocketModule,
    StorageModule,

  ],
  controllers: [EmailController,],//AppController
  providers: [SendGridService ],
})
export class AppModule { }