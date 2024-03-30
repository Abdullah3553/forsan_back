import { Module } from '@nestjs/common';
import { PTPlanModule } from './plan/plan.module';

@Module({
  imports: [
    PTPlanModule
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class PTModule {}
