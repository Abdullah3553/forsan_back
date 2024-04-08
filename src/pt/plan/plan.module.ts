import { Module } from '@nestjs/common';
import { PlanController } from './controllers/plan.controller';
import { PlanService } from './services/plan.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from './entities/plans.entity';
import { logsModule } from 'src/logsModule/logs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Plan]),
    logsModule
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