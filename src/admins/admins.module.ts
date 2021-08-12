import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Admin} from "./entity/admin.entity";

@Module({
  imports: [
      TypeOrmModule.forFeature([Admin])
  ],
  providers: [AdminsService],
  exports: [AdminsService]
})
export class AdminsModule {}
