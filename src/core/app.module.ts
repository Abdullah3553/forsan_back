import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { PlansModule } from "../plans/plans.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { db_config } from './config'
import { playersModule } from 'src/players/players.module';

@Module({
  imports: [
      TypeOrmModule.forRoot(db_config),
      PlansModule, playersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

