import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { ActivitiesController } from "./controller/activitiesController";
import { ActivitiesService } from "./services/activities.service";
import {Activity} from "./entities/activities.entity";
import { Log } from "src/logsModule/entities/logs.entitiy";
import { logsModule } from "src/logsModule/logs.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Activity]),
        logsModule
    ],
    controllers: [ActivitiesController],
    providers: [ActivitiesService],
    exports:[ActivitiesService]
})
export class ActivitiesModule {}
