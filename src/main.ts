import { NestFactory } from '@nestjs/core';
import { AppModule } from './core/app.module';
import {ValidationPipe} from "@nestjs/common";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config({
  path: __dirname+'/../../.env'
})



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT);
}

bootstrap();
