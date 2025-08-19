// nest-app/src/app.controller.ts

import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('db-status')
  checkDB() {
  return this.appService.checkDBConnection();
  }

  @Post()
  postHello(): string {
    return  'post Hello World!';
  }
}
