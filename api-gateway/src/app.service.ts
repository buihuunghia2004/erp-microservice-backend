import { Inject, Injectable } from '@nestjs/common';
import { ClientTCP } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: ClientTCP,
    @Inject('ORDER_SERVICE') private readonly orderService: ClientTCP,
  ) {}

  async getUserAndOrders(userId: number) {
    try {
      // Gọi USER_SERVICE để lấy thông tin người dùng
      const user = await this.userService
        .send({ cmd: 'get_user' }, { id: userId })
        .toPromise();

      // Gọi ORDER_SERVICE để lấy danh sách đơn hàng
      // const orders = await this.orderService
      //   .send({ cmd: 'get_orders' }, { userId })
      //   .toPromise();

      // Tổng hợp dữ liệu và trả về
      return { user };
    } catch (error) {
      console.log(error);
    }
  }
}
