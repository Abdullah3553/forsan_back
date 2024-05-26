import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PtSubscription } from './entities/subscriptions.entity';
import { logsModule } from '../../logsModule/logs.module';
import { SubscriptionsService } from './services/subscriptions.service';
import { SubscriptionsController } from './controllers/subscriptions.controller';
import { PTPlanModule } from '../plan/plan.module';
import { CoachesModule } from '../../coaches/coaches.module';
import { PlayersModule } from '../../players/players.module';
import { UserContextModule } from '../../dataConfig/userContext/user-context.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PtSubscription]),
    logsModule,
    PTPlanModule,
    PlayersModule,
    forwardRef(() => CoachesModule),
    UserContextModule
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
