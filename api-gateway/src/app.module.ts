import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import {AppPort} from '@shared/constants/config.constant'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: AppPort.USER_SERVICE_PORT },
      },
      // {
      //   name: 'EMPLOYEE_SERVICE',
      //   transport: Transport.TCP,
      //   options: { host: 'localhost', port: AppPort.EMPLOYEE_SERVICE_PORT },
      // },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}