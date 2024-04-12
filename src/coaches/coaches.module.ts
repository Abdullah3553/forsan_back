import { Module } from '@nestjs/common';
import { CoachesController } from './controller/coaches.controller';
import { CoachesService } from './service/coaches.service';
import { logsModule } from 'src/logsModule/logs.module';
import { Coach } from './entites/coaches.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Coach]),
    logsModule
],
  controllers: [CoachesController],
  providers: [CoachesService],
  exports: [CoachesService]
})
export class CoachesModule {}
