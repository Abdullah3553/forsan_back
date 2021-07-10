import { NestFactory } from '@nestjs/core';
import { AppModule } from './core/app.module';

require("dotenv").config({
  path: __dirname+'/../../.env'
})


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT);
}
bootstrap();
