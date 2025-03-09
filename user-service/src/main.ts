
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { AuthService } from './api/auth/auth.service';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { RpcGlobalExceptionFilter } from './filters/rpc-global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    bufferLogs: true,
    transport: Transport.TCP,
    options: { host: 'localhost', port: 3001 },
  });

  app.useGlobalFilters(new RpcGlobalExceptionFilter())
  app.useLogger(app.get(Logger));
  app.get(AuthService)
  await app.listen();
  return app;
}

void bootstrap();