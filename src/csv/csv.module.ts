import { Module } from '@nestjs/common';
import { CsvController } from './csv.controller';
import {CSVService} from "./csv.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Player} from "../players/entities/players.entity";
import { ActivityPlayer } from 'src/activityPlayers/entities/activityPlayers.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([Player, ActivityPlayer])
  ],
  controllers: [CsvController],
  providers: [CSVService]
})
export class CsvModule {}
