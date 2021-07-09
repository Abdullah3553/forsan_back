import { Module } from '@nestjs/common';
import { PlansController } from './controllers/plans.controller';

@Module({
  controllers: [PlansController]
})
export class PlansModule {}
