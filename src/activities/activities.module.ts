import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";
import { ActivitiesController } from "./controller/activitiesController";
import { ActivitiesService } from "./services/activities.service";
import {Activity} from "./entities/activities.entity";
import { Log } from "src/logs /entities/logs.entitiy";

@Module({
    imports: [
        TypeOrmModule.forFeature([Activity]),
        TypeOrmModule.forFeature([Log]),
    ],
    controllers: [ActivitiesController],
    providers: [ActivitiesService],
    exports:[ActivitiesService]
})
export class ActivitiesModule {}