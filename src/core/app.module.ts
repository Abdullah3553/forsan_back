import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { PlansModule } from '../plans/plans.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { db_config } from './config';
import { PlayersModule } from '../players/players.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { ActivitiesModule } from '../activities/activities.module';
import { ServicessModule } from '../servicess/servicess.module';
import { ActivityPlayersModule } from '../activityPlayers/activityPlayers.module';
import { ServicesIncomeModule } from '../servicesIncome/servicesIncome.module';
// import {PlayersWeightsModule} from "../playersWeights/playersWeights.module";
import { ActivityPlayerSubscriptionsModule } from '../activityPlayerSubscriptions/activityPlayerSubscriptions.module';
import { AdminsModule } from '../admins/admins.module';
import { AuthModule } from '../auth/auth.module';
import { logsModule } from '../logsModule/logs.module';
import { outComeModule } from 'src/outCome/outCome.module';
import { CsvModule } from '../csv/csv.module';
import { PTModule } from '../pt/pt.module';
import { CoachesModule } from '../coaches/coaches.module';
import { PhotosModule } from '../photos/photos.module';
@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot(db_config),
    PlansModule,
    CsvModule,
    PlayersModule,
    SubscriptionsModule,
    ActivitiesModule,
    ServicessModule,
    ActivityPlayersModule,
    ServicesIncomeModule,
    // PlayersWeightsModule,
    ActivityPlayerSubscriptionsModule,
    AdminsModule,
    logsModule,
    outComeModule,
    PTModule,
    CoachesModule,
    PhotosModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}

