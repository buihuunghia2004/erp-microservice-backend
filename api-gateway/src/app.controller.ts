import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('users')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getUserAndOrders(@Query('userId') userId: string) {
    const id = parseInt(userId, 10); // Chuyển đổi từ string sang number
    return this.appService.getUserAndOrders(id);
  }
}