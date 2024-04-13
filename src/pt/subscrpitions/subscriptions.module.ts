import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PtSubscription } from './entities/subscriptions.entity';
import { logsModule } from '../../logsModule/logs.module';
import { SubscriptionsService } from './services/subscriptions.service';
import { SubscriptionsController } from './controllers/subscriptions.controller';
import { PTPlanModule } from '../plan/plan.module';
import { CoachesModule } from '../../coaches/coaches.module';
import { PlayersModule } from '../../players/players.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PtSubscription]),
    logsModule,
    PTPlanModule,
    CoachesModule,
    PlayersModule
  ],
  providers: [
    SubscriptionsService
  ],
  controllers: [
    SubscriptionsController
  ],
  exports: [
    SubscriptionsService
  ]
})
export class PTSubscriptionsModule {}
