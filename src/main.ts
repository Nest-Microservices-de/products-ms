import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RpcCustomExceptionFilter } from './common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
  {
    transport: Transport.TCP,
    options: {
      host: envs.HOST,
      port: envs.PORT
    }
  });


  /***Remueve todo lo que no esta inluido en los DTOS */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );
app.useGlobalFilters(new RpcCustomExceptionFilter());

  await app.listen();
  Logger.log(`Microservice is listening on port ${envs.PORT}`);
}
bootstrap();
