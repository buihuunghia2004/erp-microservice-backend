import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class UserController {
  @MessagePattern({ cmd: 'get_user' })
  getUser(data: any) {
    return { id: data.id, name: 'John Doe2' }; // Giả lập dữ liệu
  }
}