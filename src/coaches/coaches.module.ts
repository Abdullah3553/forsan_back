import { Module, forwardRef } from '@nestjs/common';
import { CoachesController } from './controller/coaches.controller';
import { CoachesService } from './service/coaches.service';
import { logsModule } from '../logsModule/logs.module';
import { Coach } from './entities/coaches.entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PTSubscriptionsModule } from '../pt/subscrpitions/subscriptions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Coach]),
    forwardRef(() => PTSubscriptionsModule),
    logsModule
  ],
  controllers: [CoachesController],
  providers: [CoachesService],
  exports: [CoachesService]
})
export class CoachesModule {}
