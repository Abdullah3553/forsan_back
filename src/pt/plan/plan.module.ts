import { Module } from '@nestjs/common';
import { PlanController } from './controllers/plan.controller';
import { PlanService } from './services/plan.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from './entities/plans.entity';
import { logsModule } from '../../logsModule/logs.module';
import { UserContextModule } from 'src/dataConfig/userContext/user-context.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Plan]),
    logsModule,
    UserContextModule
  ],
  controllers: [
    PlanController
  ],
  providers: [
    PlanService
  ],
  exports: [
    PlanService
  ],
})
export class PTPlanModule {}
