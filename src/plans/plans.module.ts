import { Module} from '@nestjs/common';
import { PlansController } from './controllers/plans.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Plan} from "./entities/plans.entity";
import { PlansService } from './services/plans.service';
import {SubscriptionsModule} from "../subscriptions/subscriptions.module";

@Module({
  imports: [
      TypeOrmModule.forFeature([Plan]),
      SubscriptionsModule
  ],
  controllers: [PlansController],
  providers: [PlansService],
    exports: [PlansService]
})
export class PlansModule {}
