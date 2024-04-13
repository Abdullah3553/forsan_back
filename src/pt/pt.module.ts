import { Module } from '@nestjs/common';
import { PTPlanModule } from './plan/plan.module';
import { PTSubscriptionsModule } from './subscrpitions/subscriptions.module';

@Module({
  imports: [
    PTPlanModule,
    PTSubscriptionsModule
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class PTModule {}
