import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ApiModule } from './api/api.module';
import generateModulesSet from './utils/modules-set';
import { RpcToHttpExceptionFilter } from './filters/rpc-to-http-exception.filter';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

@Module({
  // imports: [
  //   ClientsModule.register([
  //     {
  //       name: 'USER_SERVICE',
  //       transport: Transport.TCP,
  //       options: { host: 'localhost', port:  },
  //     },
  //     // {
  //     //   name: 'EMPLOYEE_SERVICE',
  //     //   transport: Transport.TCP,
  //     //   options: { host: 'localhost', port: AppPort.EMPLOYEE_SERVICE_PORT },
  //     // },
  //   ]),
  //   ApiModule
  // ],
  imports: generateModulesSet(),
  // controllers: [AppController],
  providers: [{
    provide: 'APP_FILTER',
    useClass: RpcToHttpExceptionFilter, // Catch RpcException first
  },
  {
    provide: 'APP_FILTER',
    useClass: GlobalExceptionFilter, // Handle HTTP exceptions
  },],
})
export class AppModule {}