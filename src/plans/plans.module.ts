import { Module } from '@nestjs/common';
import { PlansController } from './controllers/plans.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Plan} from "./entities/plan.entity";
import { PlansService } from './services/plans.service';

@Module({
  imports: [
      TypeOrmModule.forFeature([Plan])
  ],
  controllers: [PlansController],
  providers: [PlansService]
})
export class PlansModule {}
