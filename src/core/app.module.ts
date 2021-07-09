import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import {PlansModule} from "../plans/plans.module";

@Module({
  imports: [
      PlansModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

