import { Module } from '@nestjs/common';
import { CsvController } from './csv.controller';
import {CSVService} from "./csv.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Player} from "../players/entities/players.entity";

@Module({
  imports: [
      TypeOrmModule.forFeature([Player])
  ],
  controllers: [CsvController],
  providers: [CSVService]
})
export class CsvModule {}
