// import {
//   ClassSerializerInterceptor,
//   HttpStatus,
//   RequestMethod,
//   UnprocessableEntityException,
//   ValidationError,
//   ValidationPipe,
//   VersioningType,
// } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { NestFactory, Reflector } from '@nestjs/core';
// import compression from 'compression';
// import helmet from 'helmet';
// import { Logger } from 'nestjs-pino';
// import { AuthService } from './api/auth/auth.service';
// import { AppModule } from './app.module';
// import { type AllConfigType } from './config/config.type';
// import { GlobalExceptionFilter } from './filters/global-exception.filter';
// import { AuthGuard } from './guards/auth.guard';
// import setupSwagger from './utils/setup-swagger';
// import { Transport } from '@nestjs/microservices';

// async function bootstrap() {
//   const app = await NestFactory.createMicroservice(AppModule, {
//     transport: Transport.TCP,
//     options: { host: 'localhost', port: 3001 },
//   });

//   app.useLogger(app.get(Logger));

//   const configService = app.get(ConfigService<AllConfigType>);
//   const reflector = app.get(Reflector);
//   const isDevelopment =
//     configService.getOrThrow('app.nodeEnv', { infer: true }) === 'development';
//   const corsOrigin = configService.getOrThrow('app.corsOrigin', {
//     infer: true,
//   });

//   console.info('CORS Origin:', corsOrigin);

//   app.useGlobalGuards(new AuthGuard(reflector, app.get(AuthService)));
//   app.useGlobalFilters(new GlobalExceptionFilter(configService));
//   app.useGlobalPipes(
//     new ValidationPipe({
//       transform: true,
//       whitelist: true,
//       errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
//       exceptionFactory: (errors: ValidationError[]) => {
//         return new UnprocessableEntityException(errors);
//       },
//     }),
//   );
//   app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

//   await app.listen();
  
//   return app;
// }

// void bootstrap();
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.TCP,
    options: { host: 'localhost', port: 3001 },
  });
  await app.listen();
}
bootstrap();