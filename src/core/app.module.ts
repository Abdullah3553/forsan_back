import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { PlansModule } from "../plans/plans.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { db_config } from './config'
import {PlayersModule} from "../players/players.module";
import {SubscriptionsModule} from "../subscriptions/subscriptions.module";
import {ActivitiesModule} from "../activities/activities.module";
import { ActivityPlayerModule } from 'src/activity-players/activity-player.module';
import { ServicessModule} from "../servicess/servicess.module";
import {ServiceIncomeModule} from "../serviceIncome/serviceIncome.module";
import {PlanIncomeModule} from "../planIncome/planIncome.module";
import {ActivityPlayersSubscriptionModule} from "../activity-playersSubscription/activity-playersSubscription.module";

@Module({
  imports: [
      TypeOrmModule.forRoot(db_config),
      PlansModule,
      PlayersModule,
      SubscriptionsModule,
      ActivitiesModule,
      ServicessModule,
      ActivityPlayerModule,
      ServiceIncomeModule,
      PlanIncomeModule,
      ActivityPlayersSubscriptionModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

